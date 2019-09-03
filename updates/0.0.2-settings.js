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
			'name': 'Admin',
			__ref: 'role_admin'
		},
		{
			'name': 'Staff',
			__ref: 'role_staff'
		},
		{
			'name': 'Author',
			__ref: 'role_author'
		}
	],
	Permission : [
		{
			'name': 'Role List Permissions',
			'listName': 'Role',
			'create': ['role_admin'],
			'read': ['role_admin'],
			'update': ['role_admin'],
			'delete': ['role_admin'],
			__ref: 'permission_role'
		},
		{
			'name': 'User List Permissions',
			'listName': 'User',
			'create': ['role_admin'],
			'read': ['role_admin'],
			'update': ['role_admin'],
			'delete': ['role_admin'],
			__ref: 'permission_user'
		},
		{
			'name': 'Permission List Permissions',
			'listName': 'Permission',
			'create': ['role_admin'],
			'read': ['role_admin'],
			'update': ['role_admin'],
			'delete': ['role_admin'],
			__ref: 'permission_permission'
		}
	],
	City : [
		{
			'name': 'Brisbane',
			'country': 'Australia',
			__ref: 'brisbane'
		},
		{
			'name': 'Melbourne',
			'country': 'Australia',
			__ref: 'melbourne'
		},
		{
			'name': 'Sydney',
			'country': 'Australia',
			__ref: 'sydney'
		},
		{
			'name': 'Gold Coast',
			'country': 'Australia',
			__ref: 'gold_coast'
		},
		{
			'name': 'Canberra',
			'country': 'Australia',
			__ref: 'canberra'
		},
		{
			'name': 'Adelaide',
			'country': 'Australia',
			__ref: 'adelaide'
		},
		{
			'name': 'Perth',
			'country': 'Australia',
			__ref: 'perth'
		}
	],
	University : [
		{
			'name': 'University of Queensland',
			'chineseName':'',
			'logo': '',
			'address': 'Brisbane',
			'location': 'brisbane',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Queensland University of Technology',
			'chineseName':'',
			'logo': '',
			'address': 'Brisbane',
			'location': 'brisbane',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Melbourne',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of New South Wales',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Australian National University',
			'chineseName':'',
			'logo': '',
			'address': 'Canberra',
			'location': 'canberra',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Newcastle',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Macquarie University',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Sydney',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Technology Sydney',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Wollongong',
			'chineseName':'',
			'logo': '',
			'address': 'Sydney',
			'location': 'sydney',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Bond University',
			'chineseName':'',
			'logo': '',
			'address': 'Gold Coast',
			'location': 'gold_coast',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Griffith University',
			'chineseName':'',
			'logo': '',
			'address': 'Brisbane',
			'location': 'brisbane',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Southern Queensland',
			'chineseName':'',
			'logo': '',
			'address': 'Brisbane',
			'location': 'brisbane',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Carnegie Mellon University',
			'chineseName':'',
			'logo': '',
			'address': 'Adelaide',
			'location': 'adelaide',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Monash University',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'RMIT University',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Swinburne University of Technology',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'La Trobe University,',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'Deakin University',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		},
		{
			'name': 'University of Western Australia',
			'chineseName':'',
			'logo': '',
			'address': 'Melbourne',
			'location': 'melbourne',
			'shortDescription':'',
			'description': ''
		}
	]
};