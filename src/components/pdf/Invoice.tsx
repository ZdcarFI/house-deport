import React from 'react';
import {Page, Text, View, Document, StyleSheet, Image} from '@react-pdf/renderer';
import {DataCartDto} from "@/components/aplication/orders/dto/DataCartDto";
import {ClientDto} from "@/services/Dto/ClienDto";
import Logo from '../../../public/imgs/logo.png'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 30
    },
    section: {
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    companyInfo: {
        textAlign: 'right',
    },
    table: {
        width: '100%',
        borderBottom: '1px solid #ddd',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
    },
    tableCell: {
        flex: 1,
        padding: 5,
        borderRight: '1px solid #ddd',
    },
    tableCellLast: {
        flex: 1,
        padding: 5,
    },
    total: {
        marginTop: 10,
        fontSize: 14,
        alignItems: 'flex-end',
        fontWeight: 'bold',
    },
    clientInfo: {
        marginBottom: 20,
    },
});

interface InvoiceProps {
    products: DataCartDto[];
    total: number;
    client?: ClientDto;
    date: string;
}

const Invoice = ({products, total, client, date}: InvoiceProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={Logo}/>
                    <View style={styles.companyInfo}>
                        <Text>House Deport</Text>
                        <Text>www.house-deport.com</Text>
                        <Text>Tel: +123456789</Text>
                        <Text>Fecha: {date}</Text>
                    </View>
                </View>
                <View style={styles.clientInfo}>
                    <Text>Cliente: {client?.firstName}</Text>
                    <Text>Dirección: {client?.address}</Text>
                    <Text>Teléfono: {client?.phone}</Text>
                </View>
                <View style={styles.section}>
                    <Text>Productos:</Text>
                    <View style={styles.table}>
                        {products.map((product, index) => (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                    <Text>{product.name}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{product.quantity}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>S/. {product.price}</Text>
                                </View>
                                <View style={styles.tableCellLast}>
                                    <Text>S/. {(product.price * product.quantity).toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.total}>Subtotal: S/. {(total + 0.82).toFixed(2)}</Text>
                    <Text style={styles.total}>Impuesto (18%): S/. {(total + 0.18)}</Text>
                    <Text style={styles.total}>Total: S/. {total.toFixed(2)}</Text>
                </View>
            </Page>
        </Document>);
};

export default Invoice;