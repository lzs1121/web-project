const keystone = require('keystone');
const Types = keystone.Field.Types;
function listNames() {
	const listNames = [];

	if (keystone.get('models')) {
		const array = Object.keys(keystone.get('models'));
		array.forEach(function(list) {
			// TODO:  do we return hidden lists?
			listNames.push(list.name);
		});
	}
	return listNames;
}

const Permission = new keystone.List('Permission', {
	autokey: { path: 'key', from: 'name', unique: true },
	track: true
});

Permission.add({
	name: { type: String, required: true, index: true },
	listName: { type: Types.Select, options: listNames(), required: true, initial: true, index: true },
	create: { type: Types.Relationship, ref: 'Role', many: true },
	read: { type: Types.Relationship, ref: 'Role', many: true },
	update: { type: Types.Relationship, ref: 'Role', many: true },
	delete: { type: Types.Relationship, ref: 'Role', many: true }
});

Permission.defaultColumns = 'name, create, read, update, delete';
Permission.register();

module.exports = Permission;