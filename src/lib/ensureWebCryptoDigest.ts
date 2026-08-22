import { sha256 } from "@noble/hashes/sha2.js";

function algorithmName(algorithm: AlgorithmIdentifier): string {
  return typeof algorithm === "string" ? algorithm : algorithm.name;
}

function toBytes(data: BufferSource): Uint8Array {
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }

  return new Uint8Array(data);
}

/**
 * Sandpack hashes its generated client id with Web Crypto. Browsers omit
 * SubtleCrypto on plain-HTTP LAN origins, although the rest of Sandpack works
 * there. Supply only the SHA-256 operation Sandpack needs in that environment.
 */
export function ensureWebCryptoDigest(): void {
  if (globalThis.crypto?.subtle) return;

  const digest = async (
    algorithm: AlgorithmIdentifier,
    data: BufferSource,
  ): Promise<ArrayBuffer> => {
    if (algorithmName(algorithm).toUpperCase() !== "SHA-256") {
      throw new DOMException("Only SHA-256 is supported", "NotSupportedError");
    }

    return sha256(toBytes(data)).slice().buffer as ArrayBuffer;
  };

  const subtle = { digest } as SubtleCrypto;
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { subtle },
    });
    return;
  }

  Object.defineProperty(globalThis.crypto, "subtle", {
    configurable: true,
    value: subtle,
  });
}
