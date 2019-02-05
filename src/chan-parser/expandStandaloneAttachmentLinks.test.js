import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'

describe('expandStandaloneAttachmentLinks', () => {
	it('should mark standalone attachment links in the end', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					},
					'abc',
					'\n',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						{
							type: 'link',
							attachment: {}
						},
						'abc'
					],
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					}
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should mark standalone attachment links in the beginning', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					},
					'\n',
					'abc',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					},
					[
						'abc',
						{
							type: 'link',
							attachment: {}
						}
					]
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should mark standalone attachment links when they are standalone', () => {
		const post = {
			content: [
				[
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1,
						fit: 'height'
					}
				],
				attachments: [{
					id: 1
				}]
			}
		)
	})

	it('should not mark non-standalone attachment links when there\'s text before them', () => {
		const post = {
			content: [
				[
					'abc — ',
					{
						type: 'link',
						attachment: {}
					}
				]
			],
			attachments: []
		}
		expandStandaloneAttachmentLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						'abc — ',
						{
							type: 'link',
							attachment: {}
						}
					]
				],
				attachments: []
			}
		)
	})
})