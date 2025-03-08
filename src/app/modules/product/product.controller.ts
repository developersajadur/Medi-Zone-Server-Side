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


export const productController = {
    createProductIntoDb,
    getAllProduct
}