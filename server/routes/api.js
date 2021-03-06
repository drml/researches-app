const fs         = require('fs');
const path       = require('path');
const util       = require('util');

const express = require('express');
const Finding = require('../models/finding');
const FindingSchema = require('../models/finding_schema');

const router = express.Router();

const PER_PAGE = 5;

function getPaginatedItems(items, offset) {
    return items.slice(offset, offset + PER_PAGE);
}

// get a list of findings from a db
router.get('/findings', function(req, res){
    Finding.find({}).then(function(findings){
        let offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
        let nextOffset = offset + PER_PAGE;
        let previousOffset = (offset - PER_PAGE < 1) ? 0 : offset - PER_PAGE;

        let meta = {
            limit: PER_PAGE,
            next: util.format('?limit=%s&offset=%s', PER_PAGE, nextOffset),
            offset: req.query.offset,
            previous: util.format('?limit=%s&offset=%s', PER_PAGE, previousOffset),
            total_count: findings.length
        };

        let json = {
            meta: meta,
            findings: getPaginatedItems(findings, offset)
        };

        return res.json(json);
    })
});

// get a single finding
router.get('/findings/:id', function(req, res){
    Finding.findOne({_id: req.params.id}).then(function(finding){
        res.send(finding);
    })
});

// create a new finding to the db
router.post('/findings', function(req, res, next){
    Finding.create(req.body).then(function(finding){
        res.send(finding)
    }).catch(next)

});

// update a finding in the db
router.put('/findings/:id', function(req, res){
    Finding.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Finding.findOne({_id: req.params.id}).then(function(finding){
                res.send(finding);
            }
        );
    })
});

// delete a finding from the db
router.delete('/findings/:id', function(req, res){
    Finding.findByIdAndRemove({_id: req.params.id}).then(function(finding){
        res.send(finding);
    })
});



/**
 * Schemas routes
 */

// get a list of findings schemas from a db
router.get('/findings_schemas', function(req, res){
    FindingSchema.find({}).then(function(findings_schemas){
        res.send(findings_schemas);
    })
});


// create a new finding schema
router.post('/findings_schemas', function(req, res, next){
    FindingSchema.create(req.body).then(function(finding_schema){
        res.send(finding_schema)
    }).catch(next)
});

module.exports = router;