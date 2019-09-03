const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Course Model
 * =============
 */

const Training = new keystone.List('Training', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Training.add({
	courseCode: { type: String },
	coursePhase: { type: Types.Select, options: '1,2,3,4,5', default: '1', label:'课程阶段' },
	priority: { type: Types.Number },
	name: { type: String, required: true }
}, 'SEO For Google(Required)', {
	meta: {
		title: { type: String },
		keywords: { type: String },
		description: { type: Types.Textarea, note:'Meta Description(140 words)' }
	}
}, 'Course Basic Infomation', {
	title: { type: String },
	numberOfTerms: { type:String, label:'期数' },
	numberOfPeople:{ type:Number, label:'报名人数' },
	className: { type: String, label:'课程 Class Name 用于icons: http://linearicons.com/free' },
	prerequisitecourse: { type:String, label: '先修课程' },
	prerequisiteknowledge: { type:String, label: '先修知识' },
	timeLength: { type: String, label:'课程时长' },
	courseLength:{ type: String, label:'课程节数' },
	daysPerWeek: { type: String, label:'授课频率' },
	teachingMethod: { type: String, label:'授课方式' },
	city: { type: Types.Relationship, ref: 'City', many: true, label:'开课城市' },
	level: { type: Types.Select, options: '初学者, 中级, 项目实战, 高级, Mastery', default: '初学者' },
	cardDescription: { type: String, label:'课程列表描述' },
	promoDescription: { type: String, label:'课程宣传标语' },
	courseObjective: { type: Types.Textarea, label:'课程目标' },
	technologyStack: { type: Types.Relationship, ref: 'TechnologyStack', many: true, label:'技术栈', },
	careerPaths: { type: Types.Relationship, ref: 'CareerPath', many: true, label:'就业方向', },
}, '课程时间', {
	commenceDate: { type: String, label:'课程开始时间' },
	startAppliedDate: { type: Date, default: Date.now, label:'课程申请起始时间' },
	completeDate: { type: Date, default: Date.now, label:'课程结束时间' },
	freeListenDate: { type: Date, default: Date.now, label:'公开课时间' },
	dueDate: { type: Date, default: Date.now, label:'早鸟价结束时间' }
}, '学费', {
	tuition: { type: String, label:'课程费用原价' },
	promoTuitionOffline: { type: Number, label:'线下早鸟价' },
	promoTuitionOnline: { type: Number, label:'线上早鸟价' },
	time: { type: String }
}, 'Related', {
	teachers: { type: Types.Relationship, ref: 'Teacher', many: true },
	project: { type: Types.Relationship, ref: 'Project', many: true }
}, '课程背景图', {
	// address: {type: Types.Location, defaults: { country: 'Australia' }},
	heroImage: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	heroImageAlt: { type: String },
	thumbnail: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	thumbNailAlt: { type: String },
	background: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	images: { type: Types.CloudinaryImages, autoCleanup : true, select : true }
}, '课程介绍', {
	courseIntrodcution: { type: Types.Html, wysiwyg: true, height: 400, label:'课程短介绍' },
	reasons: { type: Types.Textarea, label:'选择原因', default: '选择原因' },
	suitable: { type: Types.Textarea, label:'适合人群', default: '适合人群' },
	feature1Title: { type: String, label:'Feature 1标题' },
	feature1Detail: { type: String, label:'Feature 1内容' },
	feature2Title: { type: String, label:'Feature 2标题' },
	feature2Detail: { type: String, label:'Feature 2内容' },
	feature3Title: { type: String, label:'Feature 3标题' },
	feature3Detail: { type: String, label:'Feature 3内容' },
	feature4Title: { type: String, label:'Feature 4标题' },
	feature4Detail: { type: String, label:'Feature 4内容' },
	syllabusTitle:{ type: String, label:'Syllabus标题' },
	syllabusDetail:{ type: String, label:'Syllabus内容' },
	sections:{ type: Types.TextArray, label:'课堂名称:课堂内容' },
	courseScore:{ type:Number, label:'课程分数' },
	FAQs:{ type: Types.TextArray, label:'FAQs' }
}, 'Extended Infomation (Optional)', {
	comingSoon: { type: Boolean, label:'Coming Soon' },
	enrollURL: { type: String },
	className: { type: String, label:'课程 Class Name 用于icons: http://linearicons.com/free' },
	logo: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	featured: { type: Types.Select, options: 'default, homepage, recommend', default: 'default', label:'课程推荐位置' },
	courseLink: { type: Types.Url, label:'FORBIDDEN INPUT' }
});

Training.relationship({ ref:'Teacher', refPath: 'training', path:'teacher' });
Training.relationship({ ref:'Faq', refPath: 'training', path:'faq' });
Training.relationship({ ref:'CareerPath', refPath: 'trainings', path:'careerPath' });

Training.defaultColumns = 'name, tuition|20%, city|20%';

Training.register();
