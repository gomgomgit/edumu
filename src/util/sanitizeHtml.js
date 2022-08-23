import sanitizeHtml from 'sanitize-html'

export default function (html, config = {}) {
	return sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
		allowedSchemesByTag: {
			img: ['data']
		},
		...config
	})
}