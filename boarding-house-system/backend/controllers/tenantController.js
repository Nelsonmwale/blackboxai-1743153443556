const Tenant = require('../models/Tenant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Add a tenant
// @route   POST /api/v1/tenants
// @access  Private
exports.addTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.create(req.body);
  res.status(201).json({
    success: true,
    data: tenant
  });
});

// @desc    Get all tenants
// @route   GET /api/v1/tenants
// @access  Private
exports.getTenants = asyncHandler(async (req, res, next) => {
  const tenants = await Tenant.find();
  res.status(200).json({
    success: true,
    count: tenants.length,
    data: tenants
  });
});

// @desc    Get a single tenant
// @route   GET /api/v1/tenants/:id
// @access  Private
exports.getTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return next(new ErrorResponse(`No tenant found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: tenant
  });
});

// @desc    Update a tenant
// @route   PUT /api/v1/tenants/:id
// @access  Private
exports.updateTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tenant) {
    return next(new ErrorResponse(`No tenant found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: tenant
  });
});

// @desc    Delete a tenant
// @route   DELETE /api/v1/tenants/:id
// @access  Private
exports.deleteTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findByIdAndDelete(req.params.id);

  if (!tenant) {
    return next(new ErrorResponse(`No tenant found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});