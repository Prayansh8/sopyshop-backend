const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const { config } = require("../config");

const s3Client = new S3Client({
  region: config.aws.awsReasion,
  credentials: {
    accessKeyId: config.aws.awsAccessKey,
    secretAccessKey: config.aws.awsSecretKey,
  },
});

// Wrapper to maintain compatibility with v2 s3.upload(params).promise()
const s3 = {
  upload: (params) => {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: params.Bucket,
        Key: params.Key,
        Body: params.Body,
        ContentType: params.ContentType,
      },
    });

    return {
      promise: () => upload.done().then(result => ({
        Location: result.Location || `https://${params.Bucket}.s3.${config.aws.awsReasion}.amazonaws.com/${params.Key}`,
        ...result
      }))
    };
  }
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jfif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8, // 8MB
  },
  fileFilter: fileFilter,
});

const uploadImage = (file) => {
  return s3.upload({
    Bucket: config.aws.awsBucketName,
    Key: new Date().toISOString() + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  }).promise();
};

module.exports = { upload, uploadImage, s3, s3Client };

