import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:mobile_development/providers/auth_providers/login_provider.dart';
import 'package:mobile_development/routes/app_routes.dart';
import 'package:mobile_development/views/all_course_screen.dart';
import 'package:mobile_development/views/home_screen.dart';
import 'package:provider/provider.dart';


class MainPageScreen extends StatefulWidget {
  const MainPageScreen({super.key});

  @override
  State<MainPageScreen> createState() => _MainPageScreenState();
}

class _MainPageScreenState extends State<MainPageScreen> {
  final PageController _pageController = PageController();
  int _selectedIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onItemTapped(int index) {
  if (mounted) { 
    setState(() {
      _selectedIndex = index; 
    });
   
    try {
      _pageController.animateToPage(
        index,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } catch (e) {
      print('Error during page animation: $e');
    }
  }
}

@override
Widget build(BuildContext context) {
  final loginProvider = Provider.of<LoginProvider>(context);
  final String? userRole = loginProvider.userRole;

  final screenWidth = MediaQuery.of(context).size.width;
  final isSmallScreen = screenWidth < 360;
  final bottomPadding = MediaQuery.of(context).padding.bottom;
  final theme = Theme.of(context);


  return Scaffold(
    body: PageView(
      controller: _pageController,
      onPageChanged: (index) {
        if (mounted) { 
          setState(() {
            _selectedIndex = index; 
          });
        }
      },
      children: const [
        HomeScreen(),
        AllCoursesScreen(),
        // MainChatScreen(),
      
        // SettingScreen(),
      ],
    ),
    bottomNavigationBar: Container(
      height: 56.0 + bottomPadding,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
                  Colors.blue[900]!,
                  const Color.fromARGB(255, 3, 64, 133),
                  const Color.fromARGB(255, 4, 38, 100),
                ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Colors.grey[300]!,
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: GNav(
            gap: isSmallScreen ? 2 : 4,
            activeColor: Colors.white,
            iconSize: isSmallScreen ? 22 : 28,
            padding: EdgeInsets.symmetric(
              horizontal: isSmallScreen ? 10 : 14,
              vertical: 4,
            ),
            tabBackgroundColor: Colors.white.withOpacity(0.2),
            color: Colors.white70,
            textStyle: theme.textTheme.labelSmall?.copyWith(
              color: Colors.white,
              fontSize: isSmallScreen ? 14 : 16,
              fontWeight: FontWeight.w500,
            ),
            selectedIndex: _selectedIndex,
            onTabChange: (index) {
              _onItemTapped(index);
              print('Tab changed to index: $index');
            },
            rippleColor: Colors.white.withOpacity(0.5),
            backgroundColor: Colors.transparent,
            curve: Curves.easeInOut,
            duration: const Duration(milliseconds: 300),
            tabs: [
              GButton(
                icon: Icons.home,
                text: "Home",
                iconColor: _selectedIndex == 0 ? Colors.white : Colors.white70,
                textStyle: theme.textTheme.labelSmall?.copyWith(
                  color: _selectedIndex == 0 ? Colors.white : Colors.white70,
                ),
                semanticLabel: 'Home',
              ),
              GButton(
                icon: Icons.auto_stories_sharp,
                text: "My Courses",
                iconColor: _selectedIndex == 1 ? Colors.white : Colors.white70,
                textStyle: theme.textTheme.labelSmall?.copyWith(
                  color: _selectedIndex == 1 ? Colors.white : Colors.white70,
                ),
                semanticLabel: 'My Courses',
              ),
         
           
              // GButton(
              //   icon: Icons.settings,
              //   text: "Settings",
              //   iconColor: _selectedIndex == 4 ? Colors.white : Colors.white70,
              //   textStyle: theme.textTheme.labelSmall?.copyWith(
              //     color: _selectedIndex == 4 ? Colors.white : Colors.white70,
              //   ),
              //   semanticLabel: 'Settings',
              // ),
            ],
          ),
        ),
      ),
    ),
    // floatingActionButton: (_selectedIndex == 1 && userRole == 'Teacher')
    //     ? FloatingActionButton(
    //         shape: const CircleBorder(),
    //         onPressed: () {
    //           Navigator.pushNamed(context, AppRoutes.teacherDashboard);
    //         },
    //         backgroundColor:  Colors.blue,
    //         child: const Icon(Icons.add_circle_rounded, color: Colors.white, size: 28),
    //       )
    //     : null,
    // floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    // extendBody: true,
    // resizeToAvoidBottomInset: false,
  );
}
}