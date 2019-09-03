const keystone = require('keystone');
const Types = keystone.Field.Types;

const Answer = new keystone.List('Answer', {
	map: { name: 'bookId' },
	autokey: { from: 'bookId', path: 'slug', unique: true },
	track: true
});

Answer.add({
	bookId: { type: String, noedit: true },
	answer: { type: String },
	question: { type: Types.Relationship, ref: 'Question', many: true }
});
function generateID () {
	const date =Date.now().toString();
	return 'ANS'+date.slice(-6);
}

Answer.schema.pre('save', function (next) {
	this.bookId = generateID();
	if(this.packagePrice) {
		this.totalPrice = this.packagePrice;
	} else {
		this.totalPrice = this.unitPrice * this.tutoringLength;
	}
	this.wasNew = this.isNew;
	next();
});

Answer.defaultColumns = 'bookId, answer, question';

Answer.register();