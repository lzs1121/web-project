const keystone = require('keystone');

const Question = new keystone.List('Question', {
	map: { name: 'bookId' },
	autokey: { from: 'bookId', path: 'key', unique: true },
	defaultSort: '-createdAt',
	track: true
});

Question.add({
	bookId: { type: String, noedit: true, index: true },
	question: { type: String }
});
function generateID () {
	const date =Date.now().toString();
	return 'QUS'+date.slice(-6);
}

Question.schema.pre('save', function (next) {
	this.bookId = generateID();
	if(this.packagePrice) {
		this.totalPrice = this.packagePrice;
	} else {
		this.totalPrice = this.unitPrice * this.tutoringLength;
	}
	this.wasNew = this.isNew;
	next();
});

Question.defaultColumns = 'bookId|20%, question, course|20%';

Question.register();