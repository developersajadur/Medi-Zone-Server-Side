import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";


const createCategoryIntoDb = catchAsync(async (req, res) => {
    const file = req.file ?? undefined;
    const category = await categoryService.createCategoryIntoDb(req.body, file);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category created successfully",
        data: category
    });
});


const getAllCategory = catchAsync(async (req, res) => {
    const result = await categoryService.getAllCategory(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result
    });
});


const getCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category retrieved successfully",
        data: category
    });
})

const updateCategoryIntoDb = catchAsync(async (req, res) => {
    const file = req.file ?? undefined;
    const category = await categoryService.updateCategoryIntoDb(req.params.id, req.body, file);
  
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  });
  

  const deletedCategoryFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const category = await categoryService.deletedCategoryFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category deleted successfully",
        data: category
    });
  })

export const categoryController = {
    createCategoryIntoDb,
    getAllCategory,
    getCategoryById,
    updateCategoryIntoDb,
    deletedCategoryFromDB
}