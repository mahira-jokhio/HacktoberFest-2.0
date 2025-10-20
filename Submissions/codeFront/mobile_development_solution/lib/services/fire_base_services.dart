import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile_development/views/auth_screen/login_screen.dart';
import 'package:mobile_development/views/main_page_screen.dart';


class FireBaseServices { 
  void isLogin(BuildContext context) {
    final auth = FirebaseAuth.instance;
    final user = auth.currentUser;

    if (user != null) {
      Timer(
        const Duration(seconds: 3),
        () => Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainPageScreen()),
        ),
      );
    } else {
      Timer(
        const Duration(seconds: 3),
        () => Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        ),
      );
    }
  }
}
