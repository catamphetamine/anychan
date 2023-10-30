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
		).to.equal(15 * 1000)
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
		).to.equal(10 * 60 * 1000)
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
		).to.equal(10 * 60 * 1000)
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

	it('should return next updateAt for thread (refresh errors)', function() {
		const now = new Date()
		const prevUpdateAt = now.getTime()
		const latestCommentDate = new Date(now.getTime())
		const beforeLatestCommentDate = new Date(now.getTime())
		const backgroundMode = true

		const getValueForErrorCount = (errorCount) => {
			return getNextUpdateAtForThread(prevUpdateAt, {
				latestCommentDate,
				beforeLatestCommentDate,
				backgroundMode,
				refreshErrorDate: errorCount === 0 ? undefined : new Date(now.getTime()),
				refreshErrorCount: errorCount
			}) - prevUpdateAt
		}

		expect(getValueForErrorCount(0)).to.equal(60 * 1000)
		expect(getValueForErrorCount(1)).to.equal(60 * 1000)
		expect(getValueForErrorCount(2)).to.equal(60 * 1000)
		expect(getValueForErrorCount(3)).to.equal(480 * 1000)
		expect(getValueForErrorCount(4)).to.equal(1620 * 1000)
		expect(getValueForErrorCount(5)).to.equal(3840 * 1000)
		expect(getValueForErrorCount(6)).to.equal(7500 * 1000)
		expect(getValueForErrorCount(7)).to.equal(12960 * 1000)
		expect(getValueForErrorCount(8)).to.equal(20580 * 1000)
		expect(getValueForErrorCount(9)).to.equal(30720 * 1000)
		expect(getValueForErrorCount(10)).to.equal(43740 * 1000)
		expect(getValueForErrorCount(11)).to.equal(60000 * 1000)
		expect(getValueForErrorCount(12)).to.equal(60000 * 1000)
		expect(getValueForErrorCount(13)).to.equal(60000 * 1000)
	})
})