const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Course Model
 * =============
 */

const Course = new keystone.List('Course', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Course.add({
	meta: {
		title: { type: String, note: 'Required' },
		description: { type: Types.Textarea, note: 'Required' },
		keywords: { type: String, note: 'Required' }
	},
	courseCode: { type: String, note: 'Required, Check Auto-Fill' },
	courseTitle: { type: String, note: 'Required, Check Auto-Fill' },
	name: { type: String, required: true, note: 'Required' },
	description: { type: Types.Html, wysiwyg:true, height: 200, label:'课程介绍' },
	promote: { type: String },
	officialWebsite: { type: String },
	videoIds: { type: Types.TextArray, label:'YouTube视频ID', note:'例如：视频的链接是www.youtube.com/watch?v=EXapJFXgMAM ID就是EXapJFXgMAM' },
	university: { type: Types.Relationship, ref: 'University', required: true, initial: true, note: 'Required' },
	resource: { type: Types.Relationship, ref: 'Resource', many: true },
}, '课程打分', {
	coursePressure: { type: Types.Select, options: '1,2,3,4,5', default: '3', label:'易懂' },
	courseDifficulty: { type: Types.Select, options: '简易,中等,难,超难', default: '中等', label:'难度' },
	courseNutrition: { type: Types.Select, options: '1,2,3,4,5', default: '4', label:'实用' },
	passingRate: { type: String, label:'通过率' },
	reviews: { type: String, label:'评价' },
}, 'Extended Infomation (Optional)', {
	spec: { type: String },
	slogan: { type: String },
	assessmentPoints: { type: String }

});

Course.schema.pre('save', function (next) {
	// Pre-process the name
	const processedName = this.name.split(' ');
	// Auto-fill for the first situation - eg. BISM3222 Information Analysis and System Design and 32113 Advanced Database
	// Auto-fill works only when courseCode has no value
	if (!this.courseCode) {
		// Check whether guessed code ends with a number by finding its last digit
		const questionableCode = processedName[0];
		const questionableCodeEnds = questionableCode.charAt(questionableCode.length - 1);
		if (!isNaN(Number(questionableCodeEnds))) {
			this.courseCode = questionableCode;
		}
		// Auto-fill for the first situation - eg. 1621ICT Web Design & Development 
		// Check whether guessed code starts with a number and ends with a letter
		const questionableCodeStarts = questionableCode.charAt(0);
		if ((!isNaN(Number(questionableCodeStarts))) &&
			(questionableCodeEnds >='A' && questionableCode <='Z')) {
			this.courseCode = questionableCode;
		}
	}
	// Remove courseCode part
	processedName.shift();
	// Stringify the rest again
	const questionableTitle = processedName.toString().replace(/,/g, ' ');
	const booleanTitle = !!isNaN(Number(questionableTitle.charAt(0))) && ( questionableTitle.charAt(0) !== '/');
	// Auto-fill works only when courseCode has no value and questionableTitle is checked
	if (!this.courseTitle && booleanTitle) {
		this.courseTitle = questionableTitle;
	}
	// Auto-fill works for a second situation - eg. COMP 9021 Principles of Programming or COMP1001 7014 Python
	if (!this.courseCode || !this.courseTitle) {
		const secondProcessedName = this.name.split(' ');
		const secondQuestionableCode = secondProcessedName[0] + ' ' + secondProcessedName[1];
		const secondQuestionableCodeEnds = secondQuestionableCode.charAt(secondQuestionableCode.length - 1);
		const secondBooleanCode = !isNaN(Number(secondQuestionableCodeEnds));
		secondProcessedName.shift();
		secondProcessedName.shift();
		const secondQuestionableTitle = secondProcessedName.toString().replace(/,/g, ' ');
		const secondBooleanTitle = !!isNaN(Number(secondQuestionableTitle.charAt(0))) && ( secondQuestionableTitle.charAt(0) !== '/');
		// Auto-fill only works for having past both checks
		if (secondBooleanCode && secondBooleanTitle) {
			this.courseCode = secondQuestionableCode;
			this.courseTitle = secondQuestionableTitle;
		}
	}
	next();
});

Course.relationship({ ref:'Tutor', refPath: 'course', path:'tutor' });

Course.defaultColumns = 'name, courseCode|20%, university|20%, tutor|20%';

Course.register();
