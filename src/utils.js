export function downloadblob(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: 'GET',
			url,
			responseType: 'blob',
			onload: res => resolve(res.response)
		})
	})
}
