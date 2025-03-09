import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productService } from "./product.service";


const createProductIntoDb = catchAsync(async (req, res) => {
    const file = req.file ?? undefined;
    const product = await productService.createProductIntoDb(req.body, file);
    
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product created successfully",
        data: product
    });
});


const getAllProduct = catchAsync(async (req, res) => {
    const products = await productService.getAllProduct(req?.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Products retrieved successfully",
        data: products
    })
})

const updateProductInDbController = catchAsync(async (req, res) => {
    const file = req.file ?? undefined;
    const product = await productService.updateProductInDb(req.params.id, req.body, file);
  
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  });


  const deletedProductFromDB = catchAsync(async (req, res) => {
     await productService.deletedProductFromDB(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product deleted successfully",
        data: null,
    })
  })

  const getOneProductBySlug = catchAsync(async (req, res) => {
    const product = await productService.getOneProductBySlug(req.params.slug);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product retrieved successfully",
        data: product,
    })
  })
  
  const getOneProductById = catchAsync(async (req, res) => {
    const product = await productService.getOneProductById(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product retrieved successfully",
        data: product,
    })
  })
  


export const productController = {
    createProductIntoDb,
    getAllProduct,
    updateProductInDbController,
    deletedProductFromDB,
    getOneProductBySlug,
    getOneProductById
}