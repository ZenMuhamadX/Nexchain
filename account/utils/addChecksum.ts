/** @format */

import { loggingDebug } from 'logging/debug'
import crypto from 'node:crypto'

// Logging the process of adding a checksum to the address
loggingDebug('addChecksum', 'Adding checksum to address')

/**
 * Adds a checksum to a given address.
 * @param {Buffer} address - The original address to which the checksum will be added.
 * @returns {Buffer} The address appended with a 4-byte checksum.
 */
export const addChecksum = (address: Buffer): Buffer => {
	// Generate a double SHA256 hash of the address
	const firstHash = crypto.createHash('sha256').update(address).digest()
	const doubleHash = crypto.createHash('sha256').update(firstHash).digest()

	// Extract the first 4 bytes of the double SHA256 hash as the checksum
	const checksum = doubleHash.subarray(0, 4)

	// Append the checksum to the original address and return the result
	return Buffer.concat([address, checksum])
}
