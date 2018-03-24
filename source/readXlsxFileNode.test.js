import path from 'path'

import readXlsxFileNode from './readXlsxFileNode'

describe('readXlsxFileNode', () => {
	it('should read *.xlsx file on Node.js and parse JSON', () => {
		const schema = {
			'START DATE': {
				prop: 'date',
				type: Date,
				template: 'MM/DD/YYYY',
			},
			'NUMBER OF STUDENTS': {
				prop: 'numberOfStudents',
				type: Number,
				required: true
			},
			'IS FREE': {
				prop: 'course.isFree',
				type: Boolean
			},
			'COURSE TITLE': {
				prop: 'course.title',
				type: String
			},
			'CONTACT': {
				prop: 'contact',
				required: true,
				parse(value) {
					return '+11234567890'
				}
			}
		}

		return readXlsxFileNode(path.resolve(__dirname, '../test/spreadsheets/course.xlsx'), { schema }).then(({ rows, errors }) => {
			errors.should.deep.equal([])
			rows[0].date = rows[0].date.getTime()
			rows.should.deep.equal([{
				date: convertToUTCTimezone(new Date(2018, 2, 24, 12)).getTime(),
				numberOfStudents: 123,
				course: {
					isFree: true,
					title: 'Chemistry'
				},
				contact: '+11234567890',
			}])
		})
	})
})

// Converts timezone to UTC while preserving the same time
function convertToUTCTimezone(date) {
	// Doesn't account for leap seconds but I guess that's ok
	// given that javascript's own `Date()` does not either.
	// https://www.timeanddate.com/time/leap-seconds-background.html
	//
	// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
	//
	return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
}
