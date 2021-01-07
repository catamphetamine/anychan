// Currently, there seem to be no "value"-type collections.
// So this test is not included.

import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/storage/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: ''
})

describe('UserData', () => {
	it('should add/remove/get value', () => {
		storage.clear()
		userData.setAnnouncementRefreshedAt('2019-07-02')
		expectToEqual(
			storage.data,
			{
				announcementRefreshedAt: '2019-07-02'
			}
		)
		userData.setAnnouncementRefreshedAt('2019-07-04')
		expectToEqual(
			storage.data,
			{
				announcementRefreshedAt: '2019-07-04'
			}
		)
		expectToEqual(
			userData.getAnnouncementRefreshedAt(),
			'2019-07-04'
		)
		userData.removeAnnouncementRefreshedAt()
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge values', () => {
		storage.clear()
		storage.data = {
			announcementRefreshedAt: '2019-07-04'
		}
		userData.merge({
			announcementRefreshedAt: '2019-07-05'
		})
		expectToEqual(
			storage.data,
			{
				announcementRefreshedAt: '2019-07-05'
			}
		)
	})
})