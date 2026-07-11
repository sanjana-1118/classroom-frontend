import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BookOpen, GraduationCap, LayoutDashboard, Users, Building2 } from 'lucide-react'

const Dashboard = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-primary/10 p-4 rounded-full">
                    <LayoutDashboard className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-gray-100 dark:to-gray-400">
                        Welcome to Classroom
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Your complete platform for managing educational institutions.
                    </p>
                </div>
            </div>
            
            <div className="space-y-6">
                <Card className="border-t-4 border-t-primary shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">Platform Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            This application is built to streamline academic administration. It serves as a centralized hub to connect departments, subjects, teachers, and students, ensuring smooth scheduling and class management.
                        </p>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30">
                                <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm">Departments & Subjects</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Organize curricula by grouping subjects into distinct academic departments.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30">
                                <BookOpen className="w-5 h-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm">Class Scheduling</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Create classes, assign teachers, and manage capacities and schedules.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30">
                                <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm">Student Enrollment</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Allow students to enroll in active classes using unique invite codes.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30">
                                <GraduationCap className="w-5 h-5 text-purple-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm">Academic Tracking</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Maintain a historical record of active, inactive, and archived classes.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
