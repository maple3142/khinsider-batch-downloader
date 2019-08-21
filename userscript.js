// ==UserScript==
// @name              khinsider batch downloader
// @name:zh-TW        khinsider 批量下載器
// @namespace         https://blog.maple3142.net/
// @description       batch download for downloads.khinsider.com originalsoundtracks
// @description:zh-TW 批量下載 downloads.khinsider.com 的原聲帶
// @version           0.1.5
// @author            maple3142
// @match             https://downloads.khinsider.com/game-soundtracks/album/*
// @require           https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js
// @connect           66.90.93.122
// @license           MIT
// @copyright         2018, maple3142 (https://blog.maple3142.net/)
// @grant             GM_xmlhttpRequest
// ==/UserScript==

(function ($,JSZip) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
JSZip = JSZip && JSZip.hasOwnProperty('default') ? JSZip['default'] : JSZip;

function downloadblob(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: 'GET',
			url,
			responseType: 'blob',
			onload: res => resolve(res.response)
		});
	});
}

$('a:contains("click to download")').on('click', async e => {
	e.preventDefault();
	$('.albumMassDownload').prev().replaceWith(`
<div style="padding-left: 10px;">
<span>Download progress:</span>
<progress min="0" max="100" id="dp" value="0"></progress>
</div>
`);

	const title = $('h2')[0].textContent;
	const urls = $('tr>td.clickable-row:not([align])').toArray().map(el => $(el).find('a').attr('href'));
	const requests = urls.map(e => fetch(e).then(r => r.text()));
	const files = (await Promise.all(requests)).map(html => {
		const url = $(html).find('a:contains("Click here to download as MP3")').attr('href');
		return { blob: downloadblob(url), name: decodeURIComponent(url.split('/').pop()) };
	});
	const blob = await files.reduce((zip, file) => {
		zip.file(file.name, file.blob);
		return zip;
	}, new JSZip()).generateAsync({ type: 'blob' }, meta => $('#dp').attr('value', parseInt(meta.percent)));
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.download = title + '.zip';
	a.href = url;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
});

}($,JSZip));
