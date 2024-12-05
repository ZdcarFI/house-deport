import React from 'react';
import {Page, Text, View, Document, StyleSheet, Image} from '@react-pdf/renderer';
import {DataCartDto} from "@/components/aplication/orders/dto/DataCartDto";
import {ClientDto} from "@/services/Dto/ClienDto";
import Logo from '../../../public/imgs/logo.png'

const styles = StyleSheet.create({
    document: {
        fontFamily: 'Helvetica',
    },
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginRight: 15,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    companyInfo: {
        fontSize: 10,
        color: '#666666',
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#1A5F7A',
        marginBottom: 10,
    },
    clientSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    clientInfo: {
        fontSize: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableHeaderText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableCell: {
        fontSize: 10,
        flex: 1,
    },
    tableCellRight: {
        textAlign: 'right',
    },
    summarySection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    summaryLine: {
        flexDirection: 'row',
        width: 200,
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#666666',
    },
    summaryValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    totalLine: {
        flexDirection: 'row',
        width: 200,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1A5F7A',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        color: '#666666',
    },
});

interface InvoiceProps {
    products: DataCartDto[];
    total: number;
    client?: ClientDto;
    date: string;
    invoiceNumber: string;
}

const Invoice = ({products, total, client, date, invoiceNumber}: InvoiceProps) => {
    // Calculate tax and subtotal
    const taxRate = 0.18;
    const subtotal = total / (1 + taxRate);
    const tax = total - subtotal;

    return (
      <Document>
          <Page size="A4" style={styles.page}>
              {/* Header */}
              <View style={styles.header}>
                  <View style={styles.logoContainer}>
                      <Image style={styles.logo} src={Logo}/>
                      <View>
                          <Text style={styles.companyName}>House Deport1</Text>
                          <Text style={styles.companyInfo}>Retail & Home Solutions</Text>
                      </View>
                  </View>
                  <View>
                      <Text style={styles.invoiceTitle}>INVOICE</Text>
                      <Text style={styles.companyInfo}>Invoice #: {invoiceNumber}</Text>
                      <Text style={styles.companyInfo}>Date: {date}</Text>
                  </View>
              </View>

              {/* Client Information */}
              <View style={styles.clientSection}>
                  <View style={styles.clientInfo}>
                      <Text style={{fontWeight: 'bold', marginBottom: 5}}>Bill To:</Text>
                      <Text>{client?.firstName} {client?.lastName}</Text>
                      <Text>{client?.address}</Text>
                      <Text>Phone: {client?.phone}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                      <Text style={{fontWeight: 'bold', marginBottom: 5}}>House Deport</Text>
                      <Text>www.house-deport.com</Text>
                      <Text>Contact: +123 456 7890</Text>
                      <Text>Email: info@house-deport.com</Text>
                  </View>
              </View>

              {/* Product Table Header */}
              <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, {flex: 2}]}>Product Description</Text>
                  <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Quantity</Text>
                  <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Unit Price</Text>
                  <Text style={[styles.tableHeaderText, {flex: 1, textAlign: 'right'}]}>Total</Text>
              </View>

              {/* Product Table Rows */}
              {products.map((product, index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, {flex: 2}]}>{product.name}</Text>
                    <Text style={[styles.tableCell, styles.tableCellRight, {flex: 1}]}>{product.quantity}</Text>
                    <Text style={[styles.tableCell, styles.tableCellRight, {flex: 1}]}>S/. {product.price.toFixed(2)}</Text>
                    <Text style={[styles.tableCell, styles.tableCellRight, {flex: 1}]}>S/. {(product.price * product.quantity).toFixed(2)}</Text>
                </View>
              ))}

              {/* Summary Section */}
              <View style={styles.summarySection}>
                  <View style={styles.summaryLine}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryValue}>S/. {subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryLine}>
                      <Text style={styles.summaryLabel}>Tax (18%)</Text>
                      <Text style={styles.summaryValue}>S/. {tax.toFixed(2)}</Text>
                  </View>
                  <View style={styles.totalLine}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>S/. {total.toFixed(2)}</Text>
                  </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                  <Text>Thank you for your business!</Text>
                  <Text>Page 1 of 1</Text>
              </View>
          </Page>
      </Document>
    );
};

export default Invoice;