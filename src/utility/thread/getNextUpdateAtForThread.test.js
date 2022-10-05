import getNextUpdateAtForThread from './getNextUpdateAtForThread.js'

describe('getNextUpdateAtForThread', function() {
	it('should return next updateAt for thread (latest comment: 15 sec earlier)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime() - 15 * 1000)
		const beforeLatestCommentDate = new Date(now.getTime() - 20 * 1000)
		const backgroundMode = false
		expect(
			getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode
			}) - prevUpdateAt
		).to.equal(12 * 1000)
	})

	it('should return next updateAt for thread (latest comment: 15 sec earlier) (background mode)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime() - 15 * 1000)
		const beforeLatestCommentDate = new Date(now.getTime() - 20 * 1000)
		const backgroundMode = true
		expect(
			getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode
			}) - prevUpdateAt
		).to.equal(60 * 1000)
	})

	it('should return next updateAt for thread (latest comment: 15 min earlier)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime() - 15 * 60 * 1000)
		const beforeLatestCommentDate = new Date(now.getTime() - 20 * 60 * 1000)
		const backgroundMode = false
		expect(
			getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode
			}) - prevUpdateAt
		).to.equal(2 * 60 * 1000)
	})

	it('should return next updateAt for thread (latest comment: 15 min earlier) (background mode)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime() - 15 * 60 * 1000)
		const beforeLatestCommentDate = new Date(now.getTime() - 20 * 60 * 1000)
		const backgroundMode = true
		expect(
			getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode
			}) - prevUpdateAt
		).to.equal(2 * 60 * 1000)
	})

	it('should return next updateAt for thread (latest comment: a year earlier)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
		const beforeLatestCommentDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
		const backgroundMode = true
		expect(
			getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode
			}) - prevUpdateAt
		).to.equal(24 * 60 * 60 * 1000)
	})
})