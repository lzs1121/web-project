// /**
//  * This script automatically creates a default Admin user when an
//  * empty database is used for the first time. You can use this
//  * technique to insert data into any List you have defined.
//  *
//  * Alternatively, you can export a custom function for the update:
//  * module.exports = function(done) { ... }
//  * 
//  */

exports.create = {
	Role : [
		{
			'name': 'Tutor',
			__ref: 'role_tutor'
		},
		{
			'name': 'Students',
			__ref: 'role_students'
		},
		{
			'name': 'Visitor',
			__ref: 'role_visitor'
		}
	],
	Permission : [
		{
			'name': 'Tutor List Permissions',
			'listName': 'Tutor',
			'create': ['role_tutor'],
			'read': ['role_tutor'],
			'update': ['role_tutor'],
			'delete': ['role_tutor'],
			__ref: 'permission_role'
		},
		{
			'name': 'Students List Permissions',
			'listName': 'Students',
			'create': ['role_students'],
			'read': ['role_students'],
			'update': ['role_students'],
			'delete': ['role_students'],
			__ref: 'permission_user'
		}
	]
};