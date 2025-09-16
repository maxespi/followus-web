// components/connection-test.tsx
'use client'

import { useState } from 'react'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export function ConnectionTest() {
    const [isTestingConnection, setIsTestingConnection] = useState(false)
    const [connectionResult, setConnectionResult] = useState<{
        status: 'success' | 'error' | null
        message: string
        details?: any
    }>({ status: null, message: '' })

    const testConnection = async () => {
        setIsTestingConnection(true)
        setConnectionResult({ status: null, message: 'Probando conexión...' })

        try {
            console.log('Testing connection to:', process.env.NEXT_PUBLIC_API_URL)

            const response = await apiService.testConnection()

            if (response.success) {
                setConnectionResult({
                    status: 'success',
                    message: 'Conexión exitosa con el servidor',
                    details: response.data
                })
            } else {
                setConnectionResult({
                    status: 'error',
                    message: response.error || 'Error de conexión',
                    details: response
                })
            }
        } catch (error) {
            console.error('Connection test error:', error)
            setConnectionResult({
                status: 'error',
                message: error instanceof Error ? error.message : 'Error desconocido',
                details: error
            })
        } finally {
            setIsTestingConnection(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-lg">Prueba de Conexión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        <strong>URL del API:</strong> {process.env.NEXT_PUBLIC_API_URL}
                    </p>
                    {process.env.NEXT_PUBLIC_USE_DEV_IP === 'true' && (
                        <p className="text-sm text-muted-foreground">
                            <strong>IP de desarrollo:</strong> {process.env.NEXT_PUBLIC_API_DEV_IP}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        <strong>Entorno:</strong> {process.env.NODE_ENV}
                    </p>
                </div>

                <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    className="w-full"
                >
                    {isTestingConnection ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Probando...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Probar Conexión
                        </>
                    )}
                </Button>

                {connectionResult.status && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {connectionResult.status === 'success' ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Conectado
                                    </Badge>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <Badge variant="destructive">
                                        Error
                                    </Badge>
                                </>
                            )}
                        </div>

                        <p className="text-sm">{connectionResult.message}</p>

                        {connectionResult.details && (
                            <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground">
                                    Ver detalles técnicos
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                                    {JSON.stringify(connectionResult.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}