import { useState, useEffect, useCallback, useMemo } from 'react'

import schemaValidation from 'flexible-json-schema'

import isObject from '../../utility/isObject.js'

// `4chan.org` supports two types of getting CAPTCHA info:
// * JSON response from https://sys.4chan.org/captcha?board={boardId}&thread_id={threadId}
//   * Returns CAPTCHA info object, but is behind CloudFlare anti-spam protection,
//     so it may return an HTML verification page instead, which means that it would be
//     cumbersome to use for 3rd-party applications, and won't work at all for 3rd-party websites.
// * HTML response from https://sys.4chan.org/captcha?framed=1&board={boardId}&thread_id={threadId}
//   * The returned HTML page performs `window.parent.postMessage()` with CAPTCHA info object argument.
//   * But it doesn't work either due to a "Content Security Policy" error:
//     "Refused to display 'sys.4chan.com' in a frame because an ancestor violates
//     the following Content Security Policy directive: "frame-ancestors https://*.4chan.org""
//   * https://github.com/4chan/4chan-API/issues/100
export default function useGetCaptchaInfoFrame({ frameUrl }) {
	const [isLoading, setLoading] = useState(true)

	const [error, setError] = useState()
	const [captcha, setCaptcha] = useState()
	const [canRequestNewCaptchaIn, setCanRequestNewCaptchaIn] = useState()

	const onMessage = useCallback((event) => {
		if (isObject(event.data)) {
			if (isObject(event.data.twister)) {
				const result = event.data.twister

				try {
					validateTwisterCaptchaResponse(result)
				} catch (error) {
					console.error('Error while validating Twister CAPTCHA response:')
					console.error(error)
				}

				let error
				let captcha
				let canRequestNewCaptchaIn

				if (typeof result.cd === 'number') {
					canRequestNewCaptchaIn = result.cd * 1000
				}

				if (typeof result.error === 'string') {
					error = result.error
				} else {
					captcha = {
						id: result.challenge,
						expiresAt: new Date(Date.now() + result.ttl),
						image: {
							type: 'image/png',
							url: 'data:image/png;base64,' + result.img,
							width: result.img_width,
							height: result.img_height
						},
						backgroundImage: {
							type: 'image/png',
							url: 'data:image/png;base64,' + result.bg,
							width: result.bg_width,
							height: result.img_height
						}
					}
				}

				setError(error)
				setCaptcha(captcha)
				setCanRequestNewCaptchaIn(canRequestNewCaptchaIn)
			}
		}
	}, [])

	useEffect(() => {
		// Just in case `onMessage` reference changes after the initial mount.
		const onMessageListener = onMessage
		window.addEventListener('message', onMessageListener)
		return () => {
			window.removeEventListener('message', onMessageListener)
		}
	}, [])

	const iframe = useMemo(() => (
		<iframe
			width={0}
			height={0}
			frameBorder={0}
			src={frameUrl}
		/>
	), [frameUrl])

	return {
		isLoading,
		error,
		captcha,
		canRequestNewCaptchaIn,
		iframe
	}
}

// `4chan.org` CAPTCHA event data examples:
//
// {
//   "twister": {
//     "challenge": "bvPlMuE0CKUJ72T8.e466e2a19c9fdfe555def2baf3f00452aff19230758abc352aa84f971f19d9d0",
//     "ttl": 120,
//     "cd": 4,
//     "img": "iVBORw0KGgoAAAANSUhEUgAAARkAAABQAgMAAABQXumUAAAACVBMVEUJ+Qnu7u4AAADXdiBuAAAAAXRSTlMAQObYZgAABjNJREFUWIWN2L2O3DYQAGDeAhvEVwaRi6uSwoatp1gXBpyt1oJIWKp8hQKfnmIR5FKkcgLTQLa6NayFNE+Z4cyQIrla+1Tcnv4+DoeURFJp2hqt3+jHbU22X8Og9UbxTvsJ4JFOe5\/u9+5G72zhstPFO+90PSZnK7gPzg7cNsmJ43ei6ZMDJ7qNnJIYV023Gf9PvL0NziF1thMlDJ1Oo3HU5Wj5TA2QZQC3Fx6qD8c+KscXis6kYSwwqFDtCqBIFRMqjQEBJI71TqepeHEsX5pCztn6Br\/kyMaOoWu2kLZJ+wVmumKnvuDAHI\/rE1Pc3u\/M3C0G7jB6V1xwwn8UHWaeim18xXxv+LTegsW7N+vWLjlj4mAWDBXbe8ef2K3QwaPqyhkGPlNps\/OgitjZwmaa43EJu9JSMgy2cY4rw8DBBdTuFxwKYTupZwHFnjDWKjgl\/tRKuTIMt16IpzF7tZa7GnFkv3CVhGEn5ShVPhdH+3iaKD+zQ1v7VXFF6nX7N\/wJxew8tbHzmWrAzkTnrxadHeZz1FBsuBy8n37fK3INPUMHy45lJ35DtR+5QCypBItNc8lxf3+P6pXHMzvuIQZ\/PnHaydxzRoOD55MO1G64QOfQUy3Obv4t5Cniq6R9ZucqdVz5ZgznvcP1srGTxiP9pFFSASrXnjkbd\/qDNhcdaV\/vdBLWuyWn163NHDzPgUq7vBVnVKGdlNzvf9fHfu3fjZljhqhdCHjBP407\/yJzJveVuaJ4g\/PRx0NORw7+00o8vXNKeBY7q9F9IEY67x3zwE6cT3SwK0fxlPh2ix2Av+yvuN9E39PMadipxGktO8fY+QHg5OJX5XAxnimNp4XcURTPV3Zc60gXkPyEdsudh9jpxPmDy72O8ryR9tlFnnMeKN097N319Hgo9XISBx+uX7g99qnTBMfdp7xjU6fs9JYdYx\/YyeKZFh0zZI6uS+9s6DrvNOLYUL\/leP4RxwDnOXfm\/MS\/yub5yR1dPM5pM+fWuMM3OCQRh1xMxLcdHOylzh05RQ2WnK+PdEAcHICw0wPddhJnuOR0y04j8UzADkzsTPUxc8q9tLtiZ0gcfebIc\/EUEkfiXhtgz\/w3LTqnbzvudcTxSB7Mafy2cxSniJ0eX0acF\/Guv5zod3bk+CFzjiHPe3KOnNdrgJbb5cBOnztDm9TrqG0cTyHtcz3qzPkp1EuRc+T+g6Mzcbg92KGvotv\/UXuH86FeV+Jodvrg+P6cOFE\/pPfrjXd0cEpxdORg+uw6cvRjHLf\/BLwz0OfEvffde2Z1wbk+Un7pPX\/B0eyM7jufOPL+4niGbXDku1O5\/Zf+\/SxOD+PwwZW74IzuusHkjnb7zzMHn4Nh\/l4sODjn+Z6zccdbTvh3nfZf+BQ5RcXOvThdyw8ALDgD5VUcUw3ROE75\/urGzHj7uq8+61euu507b7U4I7VfHcaDOzWPW0Di2eL+ncYwz\/OsefzjHZyWLIx\/vIO76zvfbcQJ47H3bj5ggqOFj8YhK6h9nu3QXHI+qCFzbiY+H8ar11p7x8\/Rzp1qRQ74euI8YMgc+S16PzpccjQO+ZrIwSsse+szB+cwv2XOPJ43HM8+jOf9+WRe4Bw3Rb3s6NeLzubcwW7xLMpzlzmanJ1aUX12YR5YnDmVvY3yA5R1Ls94Bwd2K3fbVMu0bJ5\/eU+\/qpI89zgzNj7u4NTqiablC7qtQ0fnTo+znYbnoTRPwZlxi+X\/zBdadjRd38t6xKTn+an2TlvQJIfXSQxdZXD+eTMSPYmzcZf3EmTXzfNliYv2u4aq1vFRzI+tVQtjE8VD252vKfhU+Lyzc5c\/FzjvqudVlVr+a8MyS1j08XnfrB19KwVHDq38+NWHrThhGSFfXdO7Qmj5\/MXnZqie6N45HrojUrAPevosnhh6xWHZPAzZ2nRhJ3FsAjFbXHKypaYwT\/FLSAhRX6ca+fTM7we\/uQWheBUtigfvdM+HmagkUv39PhO3826dQpGDd1JW2aFalmkc7TF6dGqIU5Dmx8VTn2C+1Eqd\/Z1+3k+HymgVLWuvRcdvOIwcfo0PzIuBsxMW1cxhdtKFzTdVVBMXET3E3DzBCf2eHK7K\/HrhrYoWc3vv8Nt78z+1VYmuncyrIQAAAABJRU5ErkJggg==",
//     "img_width": 281,
//     "img_height": 80,
//     "bg": "iVBORw0KGgoAAAANSUhEUgAAAUoAAABQAQMAAABF3a4PAAAABlBMVEUAAADu7u6BVFV4AAAF3ElEQVRIiX2WMW8cRRTH3+aCx0XIBhIhR1ieSBS0tigSpOA1FV8jHW26WCJ49nSFy4OKBsnwDYJE4W7Xoji6lEQCcWNdkY7bkyN2T7c3j\/fezNztWQkj2Tc7+5v\/vPfm7cwDxAW+oxn6c6unEhBnWFCvDiNjHIaey+I\/GWbUcge\/CoCWidxa\/RZVj1xvQdB00MXGyDVbw4Tao\/\/XJmHC5DrKpmzGIzp7sYkuBJu9S\/2aASOJx1uat9V0RqZedcnRu95Ete2OsBFNNqxl3hjnm6jDa60142jQklcvVmh3uQl25pqxj4DmDfLo2Rr9I6DigcHX8pi6IqKKXZe1fK60hmSEvxDzdWMELfg9rTtrMuqzLY1b7bPY0xTO26r5Pdm0aI3LKJsMy8eNeCaqxgrqUp+fQ1rRcXJofoobKg8um61UO1EwYena2y4PrV54tJh2ItrESa\/FOd\/3ecgRGHbQZexc+L4OS3nUFR2UzC3Wrs+7CcIobraBOFnjssZ55qerd6B56u29pCidrkfwaBMdUjrl2rvSLyR\/aVvZ2jECSDhDICsgG\/MsoJpVl+iA5uqBqNaEPptwyJptVs1WqvcVh6GhyJuRt9Xh4OBiis6UvBahZxTUrI94rPj7WV6lnOeCAo5YdaojOuAPgdBz5RLq2nQVAaA59RQHRcVD32XYR9NmBO0IWj3VHRR5hV\/wJXd+ZPT48DDBdturNllEDWSCVlnJuyOqz08eJ\/j7zhajy\/VuGY4GRalKSyzOKmD0xJFq+UhQ3mDa5xw0obxxFitVYnu3YdTiv8WXi\/L4hktmHPb2B6QtKFwKbKzVjE4mLykCOZA1FxU8gb2k5mTM9xQPEnqLLLBp1StpV4f5Q4qXIcMrlRPKcXsD20psHUJKgbS9KiEUDKueZNWnJfTyRBPaupsAHh1AWjltVQVHhKYtocaQNfB1rlSf3boHRx7tQ+pybT8I6G\/krGEfd02uEonArwDplNEeoaDtwT4cXRJacrAY1Zir9xLKLPOG0BGjB7mg3xJqPcr5qCyj9DU6gHtBFfdJ1Wr7aB+gyrcInfbZS0JPsQGP7qfyxeYevUOoy\/cgFwOkNT0OuSO08ugLUM7uARA6hb2ntM2iSr957wnvDtzZvhoKWkES0AdD0BUjDVoyj1Dr0V30KAAc2sMHt\/bVfsFcFlDA\/AYEVY9SDsKW\/cLe3lc\/cZKVAU2sIfSY4pHfoVlyvEH2EdjMpoTqgFZobyeV6d+A56aDUmaogJ5nAS0ze5jM0v7EnvDXtgPkqVzyK7QwXfTqlN6f0Cbn20AhFtSoxKMYVUeP7eP7SLlSOvaS0BAsoy4u0KoXCu+CHll6p3bhcI6kal1+mEIXpaOMkpAOCLg9pn6pbm6Z+bj0KBBqPPrUqErQHu3hDl7WWGlQaq7z5B\/rIGs3VCt0oorwMR+WZZZ\/NpybKhkxivhqA8WAaj7a8yw\/+HO+bJKpR5sO2q7RKy4osp8fNHNsEvrkr6OvOJc9Wr2PzVGGswVd7z1Cmy5KcXXYnqiWTlMyIMWW0AVXAgNG6cM\/j6ijc5aOkFO6lVs+k4wrP5TTh9CWrcCdiIb2KRcK8A0fJuVWRKkRet4bf9+p3vh2MNib4XKJJZ9385rQidyAjR4uOtUbar4NtOWDZ4RRtea7ha5TFUsHOUGLCd1WfEfz3erRM\/\/g5izti6cG\/blN6GJVufhaiFWqOV95VA9kHFk+Jhyj0cm6UzYt5uHUFlUjV9UaNbhGp+5zfva2+lFWfegx2oeILsVWDGgVPRvjJ0FJR\/SS\/JquUfZq5tGHAS0iOiONUUSnvpjzKNdP03UEhhJ0Ul0KOukWt6TmyzDeGRNrn2VUneBairuT0It1fmhsq1AjKTokQWpvzUCKfWnSW2XWwNdFI++LdNeq0luhI2+Wt6P2pYmJzxLqFTr1EVh5EbrRbvKyW5abTh0bvZyaONJEt4ykm1qho\/D7N79I+VtcdAq9pXetazPiLvnuNP5FM8r\/AA8ATVSgDHB4AAAAAElFTkSuQmCC",
//     "bg_width": 330
//   }
// }
//
// {
//   "twister": {
//     "error": "You have to wait a while before doing this again",
//     "cd": 17
//   }
// }
//
const TWISTER_CAPTCHA_RESPONSE_SCHEMA = {
	"description": "Either an error or a CAPTCHA info object",
	"oneOfType": [{
		"is": "object",
		"when": {
			"error": {
				"$exists": true
			}
		},
		"description": "Error response",
		"schema": {
			"error": {
				"type": "string",
				"description": "Error message"
			},
			"cd": {
				"type": "nonNegativeInteger",
				"description": "Cooldown (in seconds) until the user can request another CAPTCHA"
			}
		}
	}, {
		"is": "object",
		"when": {
			"error": {
				"$exists": false
			}
		},
		"description": "CAPTCHA info response",
		"schema": {
			"cd": {
				"type": "nonNegativeInteger",
				"description": "Cooldown (in seconds) until the user can request another CAPTCHA"
			},
			"challenge": {
				"type": "string",
				"description": "CAPTCHA challenge ID"
			},
			"ttl": {
				"type": "nonNegativeInteger",
				"description": "CAPTCHA lifetime, in seconds"
			},
			"img": {
				"type": "string",
				"description": "CAPTCHA image (base64-encoded)"
			},
			"img_width": {
				"type": "nonNegativeInteger",
				"description": "CAPTCHA image width"
			},
			"img_height": {
				"type": "nonNegativeInteger",
				"description": "CAPTCHA image height"
			},
			"bg": {
				"type": "string",
				"description": "CAPTCHA image background (base64-encoded)"
			},
			"bg_width": {
				"type": "nonNegativeInteger",
				"description": "CAPTCHA image background width"
			}
		}
	}]
}

const validateTwisterCaptchaResponse = schemaValidation(TWISTER_CAPTCHA_RESPONSE_SCHEMA)
