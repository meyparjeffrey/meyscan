/**
 * Pantalla de Escáner - Rediseño Completo
 * 
 * Características:
 * - Botón "Escanear" unificado (Newland: overlay, Móvil: cámara fullscreen)
 * - Buscador avanzado sin límite con scroll infinito
 * - Vista de producto con botones gigantes ENTRADA/SALIDA centrados
 * - Responsive inteligente para todas las dimensiones
 * - Timeout de inactividad: 1 minuto
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  FlatList,
  Modal,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useScanner } from '../hooks/useScanner';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { Button } from '../components/common/Button';
import { Header } from '../components/common/Header';
import { CameraScanner } from '../components/scanner/CameraScanner';
import { SuccessModal } from '../components/modals/SuccessModal';
import { MovementService } from '../../application/services/MovementService';
import { MovementRepository } from '../../infrastructure/repositories/MovementRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';
import { MovementType } from '../../domain/types/MovementType';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { INACTIVITY_TIMEOUT_MS, DEFAULTS } from '../../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

export const ScannerScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, activeUser, setActiveUser } = useAppContext();
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { deviceType, shouldUseCamera } = useDeviceDetection();
  
  const {
    scannedCode,
    product,
    loading: scanningLoading,
    error: scanningError,
    processScannedCode,
    clear: clearScanner,
  } = useScanner();

  // Estados para búsqueda avanzada
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estados para modo escaneo
  const [scanModeActive, setScanModeActive] = useState(false);

  // Estados para movimientos
  const [movementType, setMovementType] = useState<MovementType | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  // Refs
  const hidInputRef = useRef<TextInput>(null);
  const searchInputRef = useRef<TextInput>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const productRepository = new ProductRepository();
  const movementRepository = new MovementRepository();
  const movementService = new MovementService(movementRepository, productRepository);

  const isNewland = deviceType === 'newland';
  const isLandscape = screenWidth > screenHeight;
  const isSmallHeight = screenHeight < 500;
  const isMobileHorizontal = isLandscape && screenHeight < 500;

  // Auto-retorno a Home después de 1 minuto de inactividad
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      clearScanner();
      setSelectedProduct(null);
      setSearchQuery('');
      setSearchResults([]);
      setScanModeActive(false);
      setMovementType(null);
      setQuantity('1');
      setActiveUser(null);
      navigation.navigate('Home');
    }, INACTIVITY_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scannedCode, selectedProduct?.id, movementType, saving, navigation, clearScanner, setActiveUser]);

  // Auto-focus en input HID para Newland cuando está en modo escaneo
  useEffect(() => {
    if (isNewland && scanModeActive && hidInputRef.current && !shouldUseCamera) {
      setTimeout(() => {
        hidInputRef.current?.focus();
      }, 100);
    }
  }, [isNewland, scanModeActive, shouldUseCamera]);

  // Cuando se escanea un código, buscar producto y cerrar modo escaneo
  useEffect(() => {
    if (scannedCode && !product) {
      handleScan(scannedCode);
    } else if (product) {
      setSelectedProduct(product);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
      setScanModeActive(false); // Cerrar modo escaneo al encontrar producto
      setMovementType(null); // Resetear tipo de movimiento
      setQuantity('1'); // Resetear cantidad
    } else if (scannedCode && !product && !scanningLoading) {
      // Si se escaneó pero no se encontró producto
      setScanModeActive(false);
    }
  }, [scannedCode, product, scanningLoading]);

  // Búsqueda avanzada con debounce (sin límite)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (searchQuery.trim().length < 2) {
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await productRepository.searchProducts(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleScan = async (value: string) => {
    await processScannedCode(value);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setScanModeActive(false);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleMovementTypeSelect = (type: MovementType) => {
    setMovementType(type);
    setQuantity('1');
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleConfirmMovement = async () => {
    if (!selectedProduct) {
      setSaveError(t('scanner.notFound'));
      return;
    }

    if (!activeUser) {
      setSaveError(t('scanner.errorNoUser'));
      return;
    }

    if (!movementType) {
      setSaveError(t('scanner.errorNoMovementType'));
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setSaveError(t('scanner.errorQuantity'));
      return;
    }

    // Validar cantidad máxima razonable (prevenir errores de entrada)
    if (qty > 10000) {
      setSaveError(t('scanner.errorQuantityTooLarge'));
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await movementService.recordMovement(
        selectedProduct.id,
        movementType,
        qty,
        activeUser.displayName
      );

      // Actualizar el producto con el stock actualizado desde la BD
      console.log('[ScannerScreen] Actualizando stock del producto desde BD...');
      const updatedProduct = await productRepository.findById(selectedProduct.id);
      if (updatedProduct) {
        console.log(`[ScannerScreen] ✅ Stock actualizado: ${updatedProduct.stockCurrent} (antes: ${selectedProduct.stockCurrent})`);
        setSelectedProduct(updatedProduct);
      } else {
        console.warn('[ScannerScreen] ⚠️ No se pudo obtener el producto actualizado');
      }

      // Guardar el mensaje de éxito ANTES de mostrar el modal
      const successMsg = `${movementType === 'IN' ? t('scanner.entry') : t('scanner.exit')}: ${quantity} x ${selectedProduct.name}`;
      setSuccessMessage(successMsg);
      
      setSaveSuccess(true);
      console.log('[ScannerScreen] ✅ Movimiento guardado exitosamente, saveSuccess=true');
      console.log('[ScannerScreen] Modal de éxito debería mostrarse ahora');
      console.log('[ScannerScreen] Mensaje de éxito:', successMsg);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('scanner.errorSave');
      setSaveError(errorMessage);
      console.error('[ScannerScreen] ❌ Error al guardar movimiento:', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBackToSearch = () => {
    setSelectedProduct(null);
    setSearchQuery('');
    setSearchResults([]);
    setMovementType(null);
    setQuantity('1');
    clearScanner();
    setScanModeActive(false);
    if (hidInputRef.current) {
      hidInputRef.current.focus();
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleScanButtonPress = () => {
    // Para móvil: abrir cámara directamente (sin modal)
    if (shouldUseCamera) {
      setScanModeActive(true);
      return;
    }
    
    // Para Newland REAL (Android): mostrar modal de "Modo Escaneo Activo"
    if (isNewland && Platform.OS === 'android') {
      setScanModeActive(true);
      if (hidInputRef.current) {
        setTimeout(() => {
          hidInputRef.current?.focus();
        }, 100);
      }
      return;
    }
    
    // Para Web: el input HID ya está siempre activo, solo enfocar
    if (Platform.OS === 'web' && hidInputRef.current) {
      hidInputRef.current.focus();
      // No activar scanModeActive en web, el input ya funciona
    }
  };

  const handleCloseScanMode = () => {
    setScanModeActive(false);
    if (hidInputRef.current) {
      hidInputRef.current.blur();
    }
  };

  // Estilos dinámicos basados en tamaño de pantalla - Responsive Inteligente
  const dynamicStyles = {
    container: {
      paddingHorizontal: isSmallHeight ? 10 : isMobileHorizontal ? 14 : 20,
      paddingTop: isSmallHeight ? 6 : 10,
      paddingBottom: isSmallHeight ? 6 : 12,
    },
    title: {
      fontSize: isSmallHeight ? 18 : isMobileHorizontal ? 20 : 28,
      fontWeight: '700' as const,
      marginBottom: isSmallHeight ? 6 : 10,
    },
    searchInput: {
      height: isSmallHeight ? 44 : 56,
      fontSize: isSmallHeight ? 15 : 18,
      minHeight: isSmallHeight ? 44 : 56,
    },
    productCode: {
      fontSize: isSmallHeight ? 22 : isMobileHorizontal ? 26 : 36,
      fontWeight: '700' as const,
    },
    productName: {
      fontSize: isSmallHeight ? 18 : isMobileHorizontal ? 22 : 32,
      fontWeight: '600' as const,
    },
    actionButton: {
      minHeight: isSmallHeight ? 70 : isMobileHorizontal ? 90 : 120,
      borderRadius: 16,
    },
    actionButtonText: {
      fontSize: isSmallHeight ? 22 : isMobileHorizontal ? 26 : 36,
      fontWeight: '700' as const,
    },
    productCard: {
      padding: isSmallHeight ? 14 : 20,
      marginBottom: isSmallHeight ? 16 : 24,
    },
    label: {
      fontSize: isSmallHeight ? 14 : 16,
      marginBottom: isSmallHeight ? 6 : 8,
    },
    stockText: {
      fontSize: isSmallHeight ? 20 : 24,
    },
  };

  // Si hay un producto seleccionado, mostrar vista de acción
  if (selectedProduct) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header />
        
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            dynamicStyles.container,
            { 
              alignItems: 'center',
              justifyContent: isSmallHeight ? 'flex-start' : 'center',
              minHeight: isSmallHeight ? screenHeight - 100 : undefined,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={!isSmallHeight}
        >
          {/* Botón volver */}
          <TouchableOpacity
            style={[
              styles.backButton, 
              { 
                borderColor: theme.colors.border,
                marginBottom: isSmallHeight ? 10 : 16,
                padding: isSmallHeight ? 10 : 12,
              }
            ]}
            onPress={handleBackToSearch}
          >
            <Text style={[
              styles.backButtonText, 
              { 
                color: theme.colors.text,
                fontSize: isSmallHeight ? 14 : 16,
              }
            ]}>
              ← {t('scanner.back')}
            </Text>
          </TouchableOpacity>

          {/* Información del producto */}
          <View style={[
            styles.productCard, 
            dynamicStyles.productCard,
            { 
              backgroundColor: theme.colors.surface, 
              width: '100%', 
              maxWidth: isSmallHeight ? '100%' : 600,
              borderColor: theme.colors.border,
            }
          ]}>
            <Text style={[dynamicStyles.label, { color: theme.colors.textSecondary }]}>
              {t('scanner.code')}:
            </Text>
            <Text style={[dynamicStyles.productCode, { color: theme.colors.text }]}>
              {selectedProduct.code}
            </Text>

            <View style={{ height: isSmallHeight ? 12 : 16 }} />

            <Text style={[dynamicStyles.label, { color: theme.colors.textSecondary }]}>
              {t('scanner.product')}:
            </Text>
            <Text style={[dynamicStyles.productName, { color: theme.colors.text }]} numberOfLines={3}>
              {selectedProduct.name}
            </Text>

            {selectedProduct.stockCurrent !== undefined && (
              <>
                <View style={{ height: isSmallHeight ? 12 : 16 }} />
                <Text style={[dynamicStyles.label, { color: theme.colors.textSecondary }]}>
                  Stock:
                </Text>
                <Text style={[dynamicStyles.stockText, { color: theme.colors.text }]}>
                  {selectedProduct.stockCurrent}
                </Text>
              </>
            )}
          </View>

          {/* Botones de acción CENTRADOS y RESPONSIVE */}
          {!movementType ? (
            <View
              style={[
                styles.actionButtonsContainer,
                isMobileHorizontal && styles.actionButtonsHorizontal,
                { 
                  width: '100%', 
                  maxWidth: isSmallHeight ? '100%' : 600,
                  alignItems: 'center',
                  marginBottom: isSmallHeight ? 12 : 20,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  dynamicStyles.actionButton,
                  styles.actionButton,
                  { 
                    backgroundColor: '#4CAF50', 
                    width: isMobileHorizontal ? '48%' : '100%',
                    paddingVertical: isSmallHeight ? 16 : 20,
                  },
                ]}
                onPress={() => handleMovementTypeSelect('IN')}
              >
                <Text style={[dynamicStyles.actionButtonText, { color: '#FFFFFF' }]}>
                  {t('scanner.entry')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  dynamicStyles.actionButton,
                  styles.actionButton,
                  { 
                    backgroundColor: '#F44336', 
                    width: isMobileHorizontal ? '48%' : '100%',
                    paddingVertical: isSmallHeight ? 16 : 20,
                  },
                ]}
                onPress={() => handleMovementTypeSelect('OUT')}
              >
                <Text style={[dynamicStyles.actionButtonText, { color: '#FFFFFF' }]}>
                  {t('scanner.exit')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                { 
                  width: '100%', 
                  maxWidth: isSmallHeight ? '100%' : 600,
                  alignItems: 'center',
                },
              ]}
            >
              {/* Indicador de tipo de movimiento seleccionado */}
              <View style={[
                styles.movementTypeIndicator,
                { 
                  backgroundColor: movementType === 'IN' ? '#E8F5E9' : '#FFEBEE',
                  marginBottom: isSmallHeight ? 12 : 16,
                }
              ]}>
                <Text style={[
                  styles.movementTypeText,
                  { 
                    color: movementType === 'IN' ? '#2E7D32' : '#C62828',
                    fontSize: isSmallHeight ? 18 : 20,
                  }
                ]}>
                  {movementType === 'IN' ? t('scanner.entry') : t('scanner.exit')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMovementType(null);
                    setQuantity('1');
                    setSaveError(null);
                  }}
                  style={styles.cancelMovementButton}
                >
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Campo de cantidad */}
              <View style={[
                styles.quantitySection,
                { width: '100%', marginBottom: isSmallHeight ? 12 : 16 }
              ]}>
                <Text style={[dynamicStyles.label, { color: theme.colors.text }]}>
                  {t('scanner.quantity')}:
                </Text>
                <TextInput
                  style={[
                    styles.quantityInput,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: saveError && saveError.includes(t('scanner.errorQuantity')) 
                        ? '#F44336' 
                        : theme.colors.border,
                      height: isSmallHeight ? 56 : 64,
                      fontSize: isSmallHeight ? 18 : 20,
                      minHeight: isSmallHeight ? 56 : 64,
                    },
                  ]}
                  value={quantity}
                  onChangeText={(text) => {
                    // Solo permitir números
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setQuantity(numericValue);
                    // Limpiar error si estaba relacionado con cantidad
                    if (saveError && (saveError.includes(t('scanner.errorQuantity')) || saveError.includes(t('scanner.errorQuantityTooLarge')))) {
                      setSaveError(null);
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={theme.colors.textSecondary}
                  maxLength={6}
                  selectTextOnFocus={true}
                />
              </View>

              {/* Botón Confirmar */}
              <Button
                title={saving ? t('scanner.saving') : t('scanner.confirm')}
                onPress={handleConfirmMovement}
                variant="primary"
                disabled={saving || !quantity || parseInt(quantity, 10) <= 0}
                loading={saving}
                style={[
                  styles.confirmMovementButton,
                  {
                    minHeight: isSmallHeight ? 64 : 72,
                    width: '100%',
                    marginBottom: isSmallHeight ? 12 : 20,
                  }
                ]}
                textStyle={{ 
                  fontSize: isSmallHeight ? 20 : 24, 
                  fontWeight: '700' 
                }}
              />
            </View>
          )}

          {/* Estados de error */}
          {saveError && (
            <View style={[styles.errorCard, { backgroundColor: '#FFEBEE', width: '100%', maxWidth: 600 }]}>
              <Text style={[styles.errorText, { color: '#C62828', fontSize: isSmallHeight ? 14 : 16 }]}>
                {saveError}
              </Text>
            </View>
          )}

          {saving && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                {t('scanner.saving')}...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input invisible para HID (Newland) - siempre activo */}
        {isNewland && !shouldUseCamera && (
          <TextInput
            ref={hidInputRef}
            style={styles.hiddenInput}
            value=""
            onChangeText={handleScan}
            autoFocus={false}
            showSoftInputOnFocus={false}
            keyboardType="default"
            returnKeyType="done"
          />
        )}

        {/* Modal de Éxito - Profesional y Moderno */}
        <SuccessModal
          visible={saveSuccess}
          title={t('scanner.movementRegistered')}
          message={successMessage}
          onAccept={() => {
            // Solución B: Volver automáticamente a la pantalla de búsqueda
            clearScanner();
            setSelectedProduct(null);
            setSearchQuery('');
            setSearchResults([]);
            setMovementType(null);
            setQuantity('1');
            setSaveSuccess(false);
            setSaveError(null);
            setSuccessMessage(undefined);
            // Enfocar el input de búsqueda para continuar escaneando
            if (searchInputRef.current) {
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 100);
            }
            if (hidInputRef.current) {
              setTimeout(() => {
                hidInputRef.current?.focus();
              }, 100);
            }
          }}
        />
      </KeyboardAvoidingView>
    );
  }

  // Vista de búsqueda/escaneo
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header />
      
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[dynamicStyles.title, { color: theme.colors.text }]}>
          {t('scanner.title')}
        </Text>
        <Button
          title="Home"
          onPress={() => {
            clearScanner();
            setSelectedProduct(null);
            setSearchQuery('');
            setSearchResults([]);
            setScanModeActive(false);
            setMovementType(null);
            setQuantity('1');
            setActiveUser(null);
            navigation.navigate('Home');
          }}
          variant="outline"
          style={styles.homeButton}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          dynamicStyles.container,
          {
            justifyContent: isSmallHeight ? 'flex-start' : 'center',
            minHeight: isSmallHeight ? screenHeight - 150 : undefined,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={!isSmallHeight}
      >
        {/* Buscador avanzado */}
        <View style={[styles.searchSection, { marginBottom: isSmallHeight ? 12 : 20 }]}>
          <Text style={[dynamicStyles.label, { color: theme.colors.text, marginBottom: isSmallHeight ? 6 : 8 }]}>
            {t('scanner.search')}:
          </Text>
          <TextInput
            ref={searchInputRef}
            style={[
              styles.searchInput,
              dynamicStyles.searchInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                marginBottom: isSmallHeight ? 6 : 8,
              },
            ]}
            placeholder={t('scanner.searchPlaceholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Resultados de búsqueda con scroll infinito */}
          {showSearchResults && searchResults.length > 0 && (
            <View style={[
              styles.searchResults, 
              { 
                backgroundColor: theme.colors.surface,
                maxHeight: isSmallHeight ? 250 : isMobileHorizontal ? 300 : 400,
              }
            ]}>
              <ScrollView nestedScrollEnabled={true}>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.searchResultItem,
                      { 
                        borderBottomColor: theme.colors.border,
                        padding: isSmallHeight ? 12 : 16,
                      },
                    ]}
                    onPress={() => handleProductSelect(item)}
                  >
                    <Text style={[
                      styles.searchResultCode, 
                      { 
                        color: theme.colors.textSecondary,
                        fontSize: isSmallHeight ? 13 : 14,
                      }
                    ]}>
                      {item.code}
                    </Text>
                    <Text style={[
                      styles.searchResultName, 
                      { 
                        color: theme.colors.text,
                        fontSize: isSmallHeight ? 15 : 16,
                      }
                    ]} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {searching && (
            <Text style={[styles.searchingText, { color: theme.colors.textSecondary }]}>
              {t('scanner.searching')}...
            </Text>
          )}

          {showSearchResults && searchResults.length === 0 && !searching && searchQuery.length >= 2 && (
            <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
              {t('scanner.noResults')}
            </Text>
          )}
        </View>

        {/* Botón Escanear */}
        <Button
          title={t('scanner.scanButton')}
          onPress={handleScanButtonPress}
          variant="primary"
          style={[
            styles.scanButton, 
            { 
              minHeight: isSmallHeight ? 56 : isMobileHorizontal ? 64 : 72,
              marginTop: isSmallHeight ? 12 : 20,
              marginBottom: isSmallHeight ? 12 : 20,
            }
          ]}
          textStyle={{ 
            fontSize: isSmallHeight ? 18 : isMobileHorizontal ? 20 : 24, 
            fontWeight: '700' 
          }}
        />
      </ScrollView>

      {/* Modo Escaneo: Overlay SOLO para Newland REAL (NO para web ni móvil) */}
      {/* En web, el input HID ya está siempre activo, no necesita modal */}
      {scanModeActive && isNewland && !shouldUseCamera && Platform.OS === 'android' && (
        <Modal
          visible={scanModeActive}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseScanMode}
        >
          <View style={styles.scanModeOverlay}>
            <View style={[styles.scanModeContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.scanModeTitle, { color: theme.colors.text }]}>
                {t('scanner.scanModeActive')}
              </Text>
              <Text style={[styles.scanModeHint, { color: theme.colors.textSecondary }]}>
                {t('scanner.scanModeActiveHint')}
              </Text>
              <Button
                title={t('scanner.closeScanMode')}
                onPress={handleCloseScanMode}
                variant="outline"
                style={styles.closeScanButton}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modo Escaneo: Cámara fullscreen SOLO para móvil (NO para Newland ni web) */}
      {scanModeActive && shouldUseCamera && Platform.OS !== 'web' && (
        <Modal
          visible={scanModeActive}
          transparent={false}
          animationType="slide"
          onRequestClose={handleCloseScanMode}
        >
          <View style={styles.cameraModalContainer}>
            <CameraScanner
              onScan={handleScan}
              active={scanModeActive}
              onClose={handleCloseScanMode}
              fullscreen={true}
              onError={(error) => {
                setSaveError(error);
              }}
            />
          </View>
        </Modal>
      )}

      {/* Modal de Éxito - Profesional y Moderno */}
      <SuccessModal
        visible={saveSuccess}
        title={t('scanner.movementRegistered')}
        message={successMessage}
        onAccept={() => {
          // Solución B: Volver automáticamente a la pantalla de búsqueda
          clearScanner();
          setSelectedProduct(null);
          setSearchQuery('');
          setSearchResults([]);
          setMovementType(null);
          setQuantity('1');
          setSaveSuccess(false);
          setSaveError(null);
          setSuccessMessage(undefined);
          // Enfocar el input de búsqueda para continuar escaneando
          if (searchInputRef.current) {
            setTimeout(() => {
              searchInputRef.current?.focus();
            }, 100);
          }
          if (hidInputRef.current) {
            setTimeout(() => {
              hidInputRef.current?.focus();
            }, 100);
          }
        }}
      />

      {/* Input invisible para HID (Newland) - siempre escuchando */}
      {isNewland && !shouldUseCamera && (
        <TextInput
          ref={hidInputRef}
          style={styles.hiddenInput}
          value=""
          onChangeText={handleScan}
          autoFocus={false}
          showSoftInputOnFocus={false}
          keyboardType="default"
          returnKeyType="done"
        />
      )}

      {/* Estado de escaneo */}
      {scanningLoading && !scanModeActive && (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            {t('scanner.scanning')}...
          </Text>
        </View>
      )}

      {scanningError && !scanModeActive && (
        <View style={[styles.errorCard, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.errorText, { color: '#C62828' }]}>
            {scanningError}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  homeButton: {
    minWidth: 100,
    minHeight: 64,
  },
  scrollContent: {
    flexGrow: 1,
  },
  searchSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchResults: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 8,
    maxHeight: 400,
  },
  searchResultItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchResultCode: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchingText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noResultsText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  scanButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  productCard: {
    borderRadius: 16,
    borderWidth: 2,
  },
  spacer: {
    height: 16,
  },
  actionButtonsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  actionButtonsHorizontal: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    } : {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    }),
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  successCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  scanModeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanModeContent: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 300,
    maxWidth: 400,
  },
  scanModeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanModeHint: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  closeScanButton: {
    minWidth: 200,
    minHeight: 56,
  },
  cameraModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  movementTypeIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  movementTypeText: {
    fontWeight: '700',
  },
  cancelMovementButton: {
    padding: 8,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmMovementButton: {
    marginBottom: 20,
  },
});
