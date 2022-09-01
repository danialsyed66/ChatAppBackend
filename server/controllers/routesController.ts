import { NextFunction, Response, Router } from 'express';
import { IRequest } from '../interfaces';
import { userRouter, conversationRouter, messageRouter } from '../routes';

const getInfo = (basePath: string, router: Router) => {
  const array = router.stack;

  let route,
    routes: { path: string; methods?: any }[] = [];

  array.forEach(element => {
    if (element.route)
      return routes.push({
        path: basePath + element.route?.path,
        methods: element.route?.methods,
      });

    if (element.name !== 'router') return;

    element?.handle?.stack.forEach((handle: any) => {
      route = handle?.route;
      route &&
        routes.push({
          path: basePath + route.path,
          methods: route.methods,
        });
    });
  });

  return routes;
};

export const routesInfo = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const routes: any[] = [];

  routes.push(...getInfo('/api/v1', userRouter));
  routes.push(...getInfo('/api/v1/conversations', conversationRouter));
  routes.push(...getInfo('/api/v1/messages', messageRouter));

  res.status(200).json({
    status: 'success',
    data: {
      result: routes.length,
      routes,
    },
  });
};
