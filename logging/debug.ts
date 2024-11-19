import createDebug from 'debug'
const isDebugEnabled = process.argv.includes('--debug')

/**
 * Membuat fungsi logger berbasis namespace yang hanya aktif jika `--debug` digunakan.
 * @param namespace - Namespace untuk log debug (contoh: "app:main").
 * @returns Fungsi log debug.
 */
export const loggingDebug = (
	namespace: string,
	message: string,
	...args: any
) => {
	const debug = createDebug(namespace)

	// Aktifkan hanya jika argumen `--debug` disertakan
	if (isDebugEnabled) {
		createDebug.enable(namespace) // Enable specific namespace
	}

	return debug(`[${new Date().toISOString()}] ${message}`, ...args)
}
