import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Dashboard = () => {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Administration panel for managing institutional resources
                </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Use the sidebar navigation to efficiently manage Classes and Subjects. This interface allows you to view, create, edit, and delete institutional records.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Deployment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            The frontend application is reliably deployed and hosted on Vercel, while the backend database and API services are running on Railway.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
