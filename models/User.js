const keystone = require('keystone');
const Types = keystone.Field.Types;
const rolesConfig = require('../config/roles-config');
const logger = require('../utils/logger');
import { STUDENT_ROLE } from '../utils/constants';

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');

User.add(
	{
		name: { type: Types.Name, required: true, index: true },
		email: {
			type: Types.Email,
			initial: true,
			required: true,
			index: true
		},
		backupEmail: { type: Types.Email },
		securityQuestion: { type: String },
		title: { type: String },
		avatar: {
			type: Types.CloudinaryImage,
			autoCleanup: true,
			select: true
		},
		role: {
			type: Types.Select,
			options: rolesConfig.roles.map( role => role.name),
			default: 'student'
		},
		introduction: { type: Types.Textarea },
		password: { type: Types.Password, initial: true, required: true },
		passwordStrength: { type: String, noedit: true },
		resetPasswordKey: { type: String, hidden: true },
		priority: { type: Types.Number }
	},
	'Profile',
	{
		phone: { type: String },
		wechat: { type: String },
		address: { type: String },
		linkedinUrl: { type: String },
		city: { type: Types.Relationship, ref: 'City' },
		country: { type: String },
		profile: { type: Types.Textarea },
		bio: { type: Types.Markdown },
		signature: { type: Types.Textarea },
		tags: { type: Types.TextArray, label: '亮点' }
	},
	'For Tutor',
	{
		tutor: {
			type: Types.Relationship,
			ref: 'Tutor',
			dependsOn: {
				role: 'tutor'
			}
		}
	},
	'For Teacher',
	{
		teacher: {
			type: Types.Relationship,
			ref: 'Teacher',
			dependsOn: {
				role: 'teacher'
			}
		}
	},
	'Permissions',
	{
		isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
		isVerified: {
			type: Boolean,
			label: 'Has a verified email address',
			initial: false
		}
	}
);

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

// Link to Student Model
User.schema.post('save', function() {
	const Student = keystone.list('Student');
	const role = this.role;
	const userId = this._id;
	const name = `${this.name.first} ${this.name.last}`;
	Student
		.model.findOne({ user: userId }, function(err, student) {
			// Delete associate Student when role change to others;
			if (student && role !== STUDENT_ROLE ) {
				student.remove(err => {
					if (err) logger.error(err);
				});
			}
			// Add to Student when role change to student;
			if (!student && role === STUDENT_ROLE) {
				const newStudent = new Student.model({
					user: userId,
					name
				});
				newStudent.save(err => {
					if (err) logger.error(err);
				});
			}
		});
});

// Delete associate Student when user being deleted;
User.schema.post('remove', function() {
	const Student = keystone.list('Student');
	const userId = this._id;
	if (this.role === STUDENT_ROLE) {
		Student
			.model.findOne({ user: userId }, function(err, student) {
				if (student) {
					student.remove(err => {
						if (err) logger.error(err);
					});
				}
			});
	}
});

/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Student', path: 'students', refPath: 'user' });

/**
 * Registration
 */
User.defaultColumns = 'name, email, role, isAdmin';
User.register();
