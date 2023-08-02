const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidV4 } = require("uuid");
const awsConfigs = require("config").get("files.S3");

AWS.config.update({
	accessKeyId: awsConfigs.accessKeyId,
	secretAccessKey: awsConfigs.secretAccessKey,
});

const s3Config = new AWS.S3({
	signatureVersion: "v4",
});

const isAllowedMimetype = (mime) =>
	[
		"image/png",
		"image/jpg",
		"image/jpeg",
		"image/gif",
		"image/x-ms-bmp",
		"image/webp",
		"audio/aac",
		"video/mp4",
		"application/pdf",
		"application/zip",
	].includes(mime.toString());

let fileDirectory;
let fileSize;

const fileFilter = (req, file, cb) => {
	const fileMime = file.mimetype;
	if (isAllowedMimetype(fileMime)) {
		const fileType = file.mimetype.split("/")[0];
		switch (fileType) {
			case "image":
				fileDirectory = awsConfigs.directories.images;
				fileSize = 1024 * 1024 * awsConfigs.maxFileSizeMB.images;
				break;
			case "audio":
				fileDirectory = awsConfigs.directories.audios;
				fileSize = 1024 * 1024 * awsConfigs.maxFileSizeMB.audios;
				break;
			case "video":
				fileDirectory = awsConfigs.directories.videos;
				fileSize = 1024 * 1024 * awsConfigs.maxFileSizeMB.videos;
				break;
			case "application":
				fileDirectory = awsConfigs.directories.application;
				fileSize = 1024 * 1024 * awsConfigs.maxFileSizeMB.application;
				break;
		}
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const getUniqFileName = (originalname) => {
	const name = uuidV4();
	const ext = originalname.split(".").pop();

	return `${name}.${ext}`;
};

const multerS3Config = (mainDirectory) =>
	multerS3({
		s3: s3Config,
		bucket: awsConfigs.bucket,
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			const fileName = getUniqFileName(file.originalname);
			const s3InnerDirectory = `${mainDirectory}/${fileDirectory}`;
			const finalPath = `${s3InnerDirectory}/${fileName}`;
			file.newName = fileName;
			cb(null, finalPath);
		},
	});

const upload = (mainDirectory) =>
	multer({
		storage: multerS3Config(mainDirectory),
		fileFilter: fileFilter,
		limits: {
			fileSize,
		},
	});
// USING
exports.paymentPartner = upload("game-payment-icon");

exports.publicUpload = upload("game-public");

exports.avatarUpload = upload("avatar");

exports.languageUpload = upload("game-language");

exports.gameCardUpload = upload("game-card");

exports.gameCompetitionUpload = upload("game-competition");

exports.gameBundleUpload = upload("game-bundle");

exports.ticketUpload = upload("Ticket");

exports.badgeUpload = upload("Badge");

exports.cardUploader = upload("cards");

exports.algoTrexPlanUpload = upload("AlgoTrex-plan");

exports.matchParticipant = upload("match-participant");

exports.cardTypeUpload = upload("Card-Type");

exports.attributeUpload = upload("attributes");
