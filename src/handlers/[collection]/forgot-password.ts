import { Response } from 'express'
import httpStatus from 'http-status'
import { PayloadRequest } from 'payload/dist/types'
import forgotPassword from 'payload/dist/auth/operations/forgotPassword'
import getErrorHandler from 'payload/dist/express/middleware/errorHandler'
import withPayload from '../../middleware/withPayload'
import convertPayloadJSONBody from '../../middleware/convertPayloadJSONBody'
import fileUpload from '../../middleware/fileUpload'
import i18n from '../../middleware/i18n'

async function handler(req: PayloadRequest, res: Response) {
  const collectionSlug = req.query.collection as string;

  if (!req.payload.collections?.[collectionSlug]) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Collection not found',
    })
  }

  try {
    const collection = req.payload.collections[collectionSlug]

    await forgotPassword({
      req,
      collection,
      data: { email: req.body.email },
      disableEmail: req.body.disableEmail,
      expiration: req.body.expiration,
    });

    return res.status(httpStatus.OK)
      .json({
        message: 'Success',
      });
  } catch (error) {
    const errorHandler = getErrorHandler(req.payload.config, req.payload.logger)
    return errorHandler(error, req, res, () => null);
  }
}

export default withPayload(
  fileUpload(
    i18n(
      convertPayloadJSONBody(
        handler
      )
    )
  )
)
