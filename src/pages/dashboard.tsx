import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BookOpen, GraduationCap, Server, LayoutDashboard } from 'lucide-react'

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
                        Welcome back, Admin
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your institutional resources today.
                    </p>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                {/* System Overview Card */}
                <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">System Overview</CardTitle>
                        <BookOpen className="w-4 h-4 ml-auto text-blue-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This is your centralized control panel for the <strong>Classroom Management System</strong>. 
                            From here, you can seamlessly navigate through the sidebar to:
                        </p>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md mr-3">
                                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Manage academic <strong>Classes</strong>
                            </li>
                            <li className="flex items-center">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md mr-3">
                                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Organize and update <strong>Subjects</strong>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                
                {/* Deployment Status Card */}
                <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Deployment Status</CardTitle>
                        <Server className="w-4 h-4 ml-auto text-emerald-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your application infrastructure is currently active and healthy. 
                        </p>
                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <span className="font-medium">Frontend (React)</span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                    Vercel Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <span className="font-medium">Backend & Database</span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                    Railway Online
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
