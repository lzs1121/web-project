const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Course Model
 * =============
 */

const Program = new keystone.List('Program', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Program.add({
	name: { type: String, required: true },
	training: { type: Types.Relationship, ref: 'Training' },
	programPhase: { type: Types.Select, options: '1,2,3,4,5,6,7,8,9,10,11,12,13', default: '1', label:'课程期数' },
	city: { type: Types.Relationship, ref: 'City', label:'开课城市', required: true, initial: true }
}, '课程时间', {
	commenceDate: { type: String, label:'课程时间标识' },
	commenceCourseDate: { type: Date, default: Date.now, label:'课程开始时间' },
	startAppliedDate: { type: Date, default: Date.now, label:'课程申请起始时间' },
	earlyBirdDueDate: { type: Date, default: Date.now, label:'早鸟价结束时间' },
	completeDate: { type: Date, default: Date.now, label:'课程结束时间' },
	courseLength: { type: String, label:'课程小时' },
	courseAgenda: { type: String, label:'课程安排' }
}, '学费', {
	tuition: { type: String, label:'课程费用原价' },
	tuitionOffline: { type: Number, label:'线下原价' },
	promoTuitionOffline: { type: Number, label:'线下早鸟价' },
	tuitionOnline: { type: Number, label:'线上原价' },
	promoTuitionOnline: { type: Number, label:'线上早鸟价' },
}, '课程背景图', {
	thumbnail: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	thumbNailAlt: { type: String }
}, 'Extended Infomation (Optional)', {
	highlights:{ type: Types.TextArray, label:'亮点' },
	enrollURL: { type: String, note:'Optional' }
});

Program.defaultColumns = 'name, tuition|20%, city|20%';

Program.register();
