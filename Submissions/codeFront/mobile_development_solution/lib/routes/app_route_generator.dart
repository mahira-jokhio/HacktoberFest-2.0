

import 'package:flutter/material.dart';
import 'package:mobile_development/routes/app_routes.dart';
import 'package:mobile_development/views/auth_screen/login_screen.dart';
import 'package:mobile_development/views/auth_screen/sign_up_screen.dart';
import 'package:mobile_development/views/main_page_screen.dart';
import 'package:mobile_development/views/splash_screen.dart';

class AppRouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.splash:
        return MaterialPageRoute(builder: (_) =>  SplashScreen());
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case AppRoutes.signup:
        return MaterialPageRoute(builder: (_) => const SignUpScreen());
      // case AppRoutes.mainPage:
      //   return MaterialPageRoute(builder: (_) => const MainPageScreen());  
      // case AppRoutes.forgotPassword:
      //   return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());  
      // case AppRoutes.setting:
      //   return MaterialPageRoute(builder: (_) => const SettingScreen());
      // case AppRoutes.createCourse:
      //   return MaterialPageRoute(builder: (_) => const CourseCreationScreen());
      // case AppRoutes.uploadPlaylist:
      //   return MaterialPageRoute(builder: (_) => const UploadVideoPlaylistScreen());
      // case AppRoutes.viewCourse:
      //   return MaterialPageRoute(builder: (_) => const ViewCourseScreen());
      // case AppRoutes.teacherDashboard:
      //   return MaterialPageRoute(builder: (_) => const DashboardScreen());
      // case AppRoutes.currentTeacherCourse:
      //   return MaterialPageRoute(builder: (_) => const CurrentTeacherCourse());
      // case AppRoutes.chatList:
      //   return MaterialPageRoute(builder: (_) => const ChatListScreen());

      default:
        return MaterialPageRoute(builder: (_) => const MainPageScreen());
    }
  }
}
