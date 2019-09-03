export function filesize(b) {
	const i = ~~(Math.log2(b)/10); return (b/Math.pow(1024, i)).toFixed(2) + ('KMGTPEZY'[i-1]||'') + 'B';
}