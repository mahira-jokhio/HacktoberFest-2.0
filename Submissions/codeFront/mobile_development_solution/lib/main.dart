import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_development/providers/auth_providers/login_provider.dart';
import 'package:mobile_development/providers/auth_providers/signup_providers.dart' show SignUpProvider;
import 'package:mobile_development/providers/course_provider.dart';
import 'package:mobile_development/providers/feed_back_provider.dart';
import 'package:mobile_development/providers/playlist_provider.dart';
import 'package:mobile_development/providers/progress_provider.dart';
import 'package:mobile_development/providers/review_provider.dart';
import 'package:mobile_development/providers/userProfileProvider.dart';
import 'package:mobile_development/routes/app_route_generator.dart';
import 'package:mobile_development/routes/app_routes.dart';
import 'package:provider/provider.dart';

void main() async{
   WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  await Firebase.initializeApp(
    options: const FirebaseOptions(
        apiKey: "AIzaSyCv_bwQFh24f2KZHAVoAi_oa4nFs5fBPa4",
      appId: "1:778344096939:android:a772a4e1653ea2e83183ee",
      messagingSenderId: "778344096939",
      projectId: "learningmanagemnt",
      
    ),
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
         ChangeNotifierProvider(create: (_) => LoginProvider()),
        ChangeNotifierProvider(create: (_) => SignUpProvider()),
          ChangeNotifierProvider(create: (_) => UserProfileProvider()),
        ChangeNotifierProvider(create: (_) => PlaylistProvider()),
        ChangeNotifierProvider(create: (_) => CourseProvider()),
        ChangeNotifierProvider(create: (_) => ProgressProvider()),
        ChangeNotifierProvider(create: (_) => ReviewProvider()),
                ChangeNotifierProvider(create: (_) => FeedbackProvider()), 

      ],
      child:   MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
       
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
     initialRoute: AppRoutes.splash,
            onGenerateRoute: AppRouteGenerator.generateRoute,
    ),
      );
  
  }
}
