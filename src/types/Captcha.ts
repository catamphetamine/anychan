export type Captcha = CaptchaWithImage | CaptchaWithImageSlider;

export interface CaptchaImage {
	type: 'image/png' | 'image/jpeg';
	url: string;
	width: number;
	height: number;
}

export interface CaptchaWithImage {
	id: string;
	type: 'text';
	challengeType: 'image';
	characterSet?: TextCaptchaCharacterSet;
	expiresAt: Date;
	image: CaptchaImage;
}

export interface CaptchaWithImageSlider {
	id: string;
	type: 'text';
	challengeType: 'image-slider';
	characterSet?: TextCaptchaCharacterSet;
	expiresAt: Date;
	image: CaptchaImage;
	backgroundImage: CaptchaImage;
}

export interface CaptchaFrame {
	type: 'frame';
	frameUrl: string;
}

export interface CaptchaParameters {
	canRequestNewCaptchaAt?: Date;
}

export type TextCaptchaCharacterSet = 'numeric' | 'russian'

export type TextCaptchaSolution = string