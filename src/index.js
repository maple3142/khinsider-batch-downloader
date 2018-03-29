import $ from 'jquery'
import JSZip from 'jszip'
import { downloadblob } from './utils'

$('a:contains("click to download")').on('click', async e => {
	e.preventDefault()
	$('.albumMassDownload').prev().replaceWith(`
<div style="padding-left: 10px;">
<span>Download progress:</span>
<progress min="0" max="100" id="dp" value="0"></progress>
</div>
`)

	const title = $('h2')[0].textContent
	const urls = $('tr>td.clickable-row:not([align])')
		.toArray()
		.map(el =>
			$(el)
				.find('a')
				.attr('href')
		)
	const requests = urls.map(e => fetch(e).then(r => r.text()))
	const files = (await Promise.all(requests)).map(html => {
		const url = $(html)
			.find('a:contains("Click here to download as MP3")')
			.attr('href')
		return { blob: downloadblob(url), name: decodeURIComponent(url.split('/').pop()) }
	})
	const blob = await files
		.reduce((zip, file) => {
			zip.file(file.name, file.blob)
			return zip
		}, new JSZip())
		.generateAsync({ type: 'blob' }, meta => $('#dp').attr('value', parseInt(meta.percent)))
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.download = title + '.zip'
	a.href = url
	document.body.appendChild(a)
	a.click()
	a.remove()
	URL.revokeObjectURL(url)
})
