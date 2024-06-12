import IoCContainer, { SCOPES } from '$lib/config/ioc';
import ActivityController from '$lib/controller/activityController';
import CallbackController from '$lib/controller/callbackController';
import GroupController from '$lib/controller/groupController';
import IndexController from '$lib/controller/indexController';
import LoginController from '$lib/controller/loginController';
import LogoutController from '$lib/controller/logoutController';
import NavBarController from '$lib/controller/navbarController';
import ProfileController from '$lib/controller/profileController';

const container = new IoCContainer();

container.register('ActivityControllerSingleton', ActivityController, SCOPES.SINGLETON);
container.register('CallbackControllerSingleton', CallbackController, SCOPES.SINGLETON);
container.register('GroupControllerSingleton', GroupController, SCOPES.SINGLETON);
container.register('IndexControllerSingleton', IndexController, SCOPES.SINGLETON);
container.register('LoginControllerSingleton', LoginController, SCOPES.SINGLETON);
container.register('LogoutControllerSingleton', LogoutController, SCOPES.SINGLETON);
container.register('ProfileControllerSingleton', ProfileController, SCOPES.SINGLETON);
container.register('NavBarControllerSingleton', NavBarController, SCOPES.SINGLETON);

export default container;
