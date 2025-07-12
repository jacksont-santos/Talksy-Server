// import { Router } from 'express';

// export function wrapRoutes(router: Router) {
//   const wrappedRouter = Router();

//   router.stack.forEach((layer) => {
//     if (layer.route) {
//       layer.route.stack.forEach((handlerLayer) => {
//         const method = handlerLayer.method?.toLowerCase() || 'use';
//         const handlers = layer.route.stack.map((handlerLayer) => {
//           return async (req, res, next) => {
//             try {
//               await handlerLayer.handle(req, res, next);
//             } catch (error) {
//               next(error);
//             }
//           };
//         });

//         wrappedRouter[method](layer.route.path, ...handlers);
//       });
//     } else {
//       wrappedRouter.use(layer.handle);
//     }
//   });

//   return wrappedRouter;
// }
