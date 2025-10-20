import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_development/components/appColor.dart';
import 'package:mobile_development/providers/auth_providers/login_provider.dart';
import 'package:mobile_development/routes/app_routes.dart';
import 'package:mobile_development/views/widgets/gradient_button.dart';
import 'package:provider/provider.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();

  @override
  void initState() {
    super.initState();
    print('LoginScreen initialized');
    
    _emailFocus.addListener(() {
      print('Email field focus: ${_emailFocus.hasFocus}');
    });
    _passwordFocus.addListener(() {
      print('Password field focus: ${_passwordFocus.hasFocus}');
    });
  }

  @override
  void dispose() {
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loginProvider = Provider.of<LoginProvider>(context);
    var screenHeight = MediaQuery.of(context).size.height;
    print('LoginScreen rebuilt');
  

    return Scaffold(
      resizeToAvoidBottomInset: false, 
      backgroundColor: Colors.white,
      body: SizedBox(
        height: screenHeight,
        child: Column(
          children: [
            Expanded(
              child: Stack(
                children: [
                  Container(
                    width: MediaQuery.sizeOf(context).width,
                    height: MediaQuery.sizeOf(context).height * 0.5,
                    decoration:  BoxDecoration(
                      borderRadius: BorderRadius.only(bottomLeft: Radius.circular(20)),
                         gradient:  LinearGradient(
    colors: 
     [Color(0xFF6DD5FA), Color.fromARGB(255, 15, 68, 104)],
    begin: Alignment.topRight,
    end: Alignment.bottomLeft,
        )
                    ),
                    child: Center(
                      child: SizedBox(
                        width: MediaQuery.sizeOf(context).width * 0.6,
                        height: MediaQuery.sizeOf(context).height * 0.6,
                        child: Icon(Icons.person)
                      ),
                    ),
                  ),
                  Positioned(
                    top: 340,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      decoration:  BoxDecoration(
                        color: AppColors.cardBackground(context),
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(23),
                          topRight: Radius.circular(23),
                        ),
                      ),
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: EdgeInsets.only(
                          bottom: MediaQuery.of(context).viewInsets.bottom + 20,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Form(
                              key: _formKey,
                              child: Column(
                                children: [
                                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                                  _buildTextField(
                                    controller: loginProvider.emailController,
                                    focusNode: _emailFocus,
                                    hintText: 'Email',
                                    icon: Icons.email_outlined,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Enter email';
                                      }
                                      if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                                        return 'Enter a valid email address';
                                      }
                                      return null;
                                    },
                                  ),
                                  const SizedBox(height: 10),
                                  _buildTextField(
                                    controller: loginProvider.passwordController,
                                    focusNode: _passwordFocus,
                                    hintText: 'Password',
                                    icon: Icons.lock_clock_outlined,
                                    obscureText: loginProvider.obscurePassword,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Enter password';
                                      }
                                      return null;
                                    },
                                    togglePasswordVisibility: loginProvider.togglePasswordVisibility,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 30),
                            GradientButton(
                              title: 'Login',
                              loading: loginProvider.loading,
                              ontap: () {
                                print('Login button tapped');
                                if (_formKey.currentState!.validate()) {
                                  loginProvider.login(context);
                                }
                              },
                            ),
                            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
                          
        
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                 Text(
                                  "Don't have an account? ",
                                  style: TextStyle(
                                    color:  Color.fromARGB(255, 124, 93, 93),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextButton(
                                  style: TextButton.styleFrom(
                                    padding: EdgeInsets.zero,
                                    minimumSize: const Size(0, 0),
                                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  ),
                                  onPressed: () {
                                    print('Sign up button tapped');
                                    FocusScope.of(context).unfocus();
                                    Navigator.pushNamed(context, AppRoutes.signup);
                                  },
                                  child:  Text(
                                    'Sign up',
                                    style: TextStyle(
                                      color:AppColors.iconPrimary
                                      ,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required FocusNode focusNode,
    required String hintText,
    required IconData icon,
    bool obscureText = false,
    String? Function(String?)? validator,
    VoidCallback? togglePasswordVisibility,
  }) {
    return TextFormField(
      controller: controller,
      focusNode: focusNode,
      obscureText: obscureText,
      onTap: () {
        print('Tapped $hintText field');
        FocusScope.of(context).requestFocus(focusNode);
      },
      decoration: InputDecoration(
        prefixIcon: Icon(icon,color: AppColors.iconPrimary,),
        hintText: hintText,
        filled: true,
        fillColor: AppColors.cardBackground(context),
        contentPadding: const EdgeInsets.symmetric(vertical: 13, horizontal: 12),
        suffixIcon: hintText == 'Password'
            ? IconButton(
                icon: Icon(
                  obscureText ? Icons.visibility_off : Icons.visibility,
                  color: Colors.grey,
                ),
                onPressed: togglePasswordVisibility,
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30.0),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30.0),
          borderSide: const BorderSide(color: Colors.blue),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30.0),
          borderSide: const BorderSide(color: Colors.grey),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30.0),
          borderSide: const BorderSide(color: Colors.blue),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30.0),
          borderSide: const BorderSide(color: Colors.blue),
        ),
      ),
      style: TextStyle(color: AppColors.textPrimary(context)),
      validator: validator,
    );
  }
}