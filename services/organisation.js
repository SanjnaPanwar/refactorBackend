// services/organisationService.js
const sequelize = require('sequelize')
const AWS = require('aws-sdk');
require('dotenv').config();
const Organisation = require('../models/organisation');
const Campaign = require('../models/Campaign');
// const CampaignUser = require('../models/CampaignUser');
// const CampaignConfig = require('../models/campaignConfig');
// const CustData = require('../models/CustData');
const CMSUser = require('../models/cmsUser');
// const CMSUserService = require('./cmsUser');


module.exports = {

    async createOrganisation(organisationData) {
        try {
            // Check if organisation already exists
            const existingOrganisation = await Organisation.findOne({ where: { name: organisationData.name } });
            if (existingOrganisation) {
                throw new Error('Organisation already exists.');
            }

            const organisation = await Organisation.create(organisationData);
            return organisation;
        } catch (error) {
            throw new Error('Error creating organisation: ' + error.message);
        }
    },

    async getOrganisations(emailid, usertype) {
        if (usertype === 'superadmin') {
            return await Organisation.findAll();
        } else if (usertype === 'admin' || usertype === 'user') {
            const user = await CMSUser.findOne({ where: { email: emailid } });
            if (!user) {
                throw new Error('User not found');
            }
            const organisationId = user.organisation_id;
            const organisation = await Organisation.findOne({ where: { id: organisationId } });
            if (!organisation) {
                throw new Error('Organisation not found');
            }
            return organisation;
        } else {
            throw new Error('Invalid usertype');
        }
    },

   

    async updateOrganisation(organisationId, updatedData) {
        try {
            // Find the organization by ID
            const organisation = await Organisation.findByPk(organisationId);

            // If the organization is not found, return null
            if (!organisation) {
                return null;
            }

            // Update the organization with the provided data
            await organisation.update(updatedData);

            // Return the updated organization
            return organisation;
        } catch (error) {
            // If an error occurs, throw it so it can be caught by the route handler
            throw new Error('Error updating organisation:', error);
        }
    },

    async getOrganisationWithCampaignsById(organisationId) {
        try {
            // Find the organization by ID and include its associated campaigns
            const organisationWithCampaigns = await Organisation.findByPk(organisationId, {
                include: [{
                    model: Campaign
                }]
            });
            return organisationWithCampaigns;
        } catch (error) {
            throw new Error('Error fetching organisation with campaigns:-->', error.message);

        }

    }

    // async getOrganisationDetails(name) {
    //     try {
    //         const organisation = await Campaign.findAll({
    //             attributes: ['campaignid', 'campaign_name', 'scantype', 'desc',
    //                 [sequelize.literal('DATE_FORMAT(startdate, "%Y-%m-%d")'), 'startdate'],
    //                 [sequelize.literal('DATE_FORMAT(enddate, "%Y-%m-%d")'), 'enddate'], 'status'],
    //             where: { organisation: name }
    //         });
    //         if (!organisation) {
    //             throw new Error('Organisation not found');
    //         }
    //         return organisation;
    //     } catch (error) {
    //         throw new Error('Error fetching organisation details: ' + error.message);
    //     }
    // },

    // async editOrganisation(organisationName, newOrganisationName, newDesc) {
    //     try {
    //         const organisation = await Organisation.findOne({ where: { organisation: organisationName } });

    //         if (!organisation) {
    //             throw new Error('Organisation not found');
    //         }

    //         const updateFields = {};
    //         if (newOrganisationName) {
    //             updateFields.organisation = newOrganisationName;
    //         }
    //         if (newDesc) {
    //             updateFields.desc = newDesc;
    //         }

    //         await Organisation.update(updateFields, { where: { organisation: organisationName } });

    //         return 'Organisation updated successfully';
    //     } catch (error) {
    //         throw new Error('Error updating organisation: ' + error.message);
    //     }
    // },

    // async deleteorganisationData(organisationName) {
    //     const transaction = await sequelize.transaction();

    //     try {
    //         // Delete organisation
    //         await Organisation.destroy({ where: { organisation: organisationName }, transaction });

    //         // Fetch campaign IDs
    //         const campaignIds = await Campaign.findAll({ where: { organisation: organisationName }, attributes: ['campaignid'], transaction });
    //         const campaignIdsArray = campaignIds.map(campaign => campaign.campaignid);

    //         // Delete campaigns and related data
    //         await Campaign.destroy({ where: { organisation: organisationName }, transaction });
    //         await CampaignConfig.destroy({ where: { campaignid: campaignIdsArray }, transaction });
    //         await CustData.destroy({ where: { campaignid: campaignIdsArray }, transaction });
    //         await CampaignUser.destroy({ where: { campaignid: campaignIdsArray }, transaction });

    //         // Delete users
    //         await cmsUser.destroy({ where: { organisation: organisationName }, transaction });

    //         // Commit the transaction
    //         await transaction.commit();

    //         // Delete files from S3
    //         const s3 = new AWS.S3();
    //         const bucketName = process.env.BUCKET_NAME; // Replace with your bucket name
    //         const deleteFromS3Promises = campaignIdsArray.map(campaignId => {
    //             const s3DeleteParams = {
    //                 Bucket: bucketName,
    //                 Prefix: campaignId + '/', // Assuming the campaignId is used as the folder name in S3
    //             };
    //             return s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: [{ Key: s3DeleteParams.Prefix }] } }).promise();
    //         });

    //         await Promise.all(deleteFromS3Promises);

    //         return 'Data deletion completed successfully.';
    //     } catch (error) {
    //         // Rollback the transaction in case of any error
    //         await transaction.rollback();
    //         throw new Error('Error deleting organisation data: ' + error.message);
    //     }
    // },

    // async getOrganisations(emailid, usertype) {
    //     if (usertype === 'superadmin') {
    //         return await Organisation.findAll({
    //             attributes: ['organisation', 'desc', 'createddate'],
    //         });;
    //     } else if (usertype === 'admin' || usertype === 'user') {
    //         const userOrganisation = await CMSUserService.getUserOrganisation(emailid);
    //         return await Organisation.findAll({
    //             attributes: ['organisation', 'desc', 'createddate'],
    //             where: { organisation: userOrganisation }
    //         });
    //     } else {
    //         throw new Error('Invalid user type');
    //     }
    // },




};
