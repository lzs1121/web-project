const keystone = require('keystone');
const Types = keystone.Field.Types;
const urlConfig = require('../../config/url-config.json');

/**
 * Course Model
 * =============
 */

const Resource = new keystone.List('Resource', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

const storage = new keystone.Storage({
	adapter: require('keystone-storage-adapter-s3'),
	s3: {
		key: process.env.S3_KEY, // required; defaults to process.env.S3_KEY
		secret: process.env.S3_SECRET, // required; defaults to process.env.S3_SECRET
		bucket: 'jracademy', // required; defaults to process.env.S3_BUCKET
		region: 'ap-southeast-2', // optional; defaults to process.env.S3_REGION, or if that's not specified, us-east-1
		path: '/resources', // optional; defaults to "/"
		publicUrl: 'https://jiangren.com.au', // optional; sets a custom domain for public urls - see below for details
		uploadParams: { // optional; add S3 upload params; see below for details
			ACL: 'public-read'
		}
	},
	schema: {
		bucket: true, // optional; store the bucket the file was uploaded to in your db
		etag: true, // optional; store the etag for the resource
		path: true, // optional; store the path of the file in your db
		url: true // optional; generate & store a public URL
	}
});

Resource.add({
	name: { type: String, required: true, note: 'Required' },
	description: { type: String, note: 'Required' },
	uploadResource: { type: Types.File, storage: storage, ref: 'Only Support zip and pdf. Max-size: 18mb' },
	resourceLink: { type: String, ref: 'Resource Link or upload resouce directly' },
	tutor: { type: Types.Relationship, ref: 'Tutor' },
	requestTimes: { type: Types.Number, default: 0, noedit: true },
	university: { type: Types.Relationship, ref: 'University' },
	course: { type: Types.Relationship, ref: 'Course' },
	note: { type: String }
});

/** 
 * pre hook is a mongoose middleware, as a plugin for KeystoneJS Lists
/* view more on https://keystonejs.com/documentation/database/#lists-plugins
/* and https://mongoosejs.com/docs/middleware.html
*/
Resource.schema.pre('save', function (next) {
	const { filename } = this.uploadResource;
	// When there is an uploaded file, resource link is not allowed to be deleted manually
	if (filename !== null && this.resourceLink === '') {
		this.resourceLink = urlConfig.s3Url + filename;
	}
	// before saving data to MangoDB, check whether a file is uploaded, changed, or removed
	// for "Upload Resource", then alter the value of "Resource Link" as per change
	if (this.isModified('uploadResource')) {
		if (filename !== null) {
			this.resourceLink = urlConfig.s3Url + filename;
		}
		else {
			this.resourceLink = null;
		}
	}
	next();
});

Resource.relationship({ ref:'Course', refPath: 'resource', path:'course' });

Resource.defaultColumns = 'name, university, Course, requestTimes|15%';

Resource.register();
