import { useState } from 'react'
import {
  View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView, Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { identifyPlant } from '../services/plantnet'
import ResultCard from './ResultCard'
import { C } from '../theme'

export default function ScanScreen({ onGoCollection }) {
  const [status, setStatus] = useState('idle') // idle | scanning | result | notplant | error
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)

  async function pickFrom(launcher, requestPerm) {
    const perm = await requestPerm()
    if (!perm.granted) {
      Alert.alert('No access', 'Please allow camera / gallery access in settings.')
      return
    }
    const res = await launcher({ quality: 0.6 })
    if (res.canceled) return
    const asset = res.assets[0]
    setPreview(asset.uri)
    setStatus('scanning')
    try {
      const r = await identifyPlant(asset.uri)
      if (r.notPlant) {
        setStatus('notplant')
        return
      }
      setResult(r)
      setStatus('result')
    } catch (e) {
      setStatus('error')
    }
  }

  const takePhoto = () =>
    pickFrom(ImagePicker.launchCameraAsync, ImagePicker.requestCameraPermissionsAsync)
  const pickGallery = () =>
    pickFrom(ImagePicker.launchImageLibraryAsync, ImagePicker.requestMediaLibraryPermissionsAsync)

  function reset() {
    setStatus('idle')
    setResult(null)
    setPreview(null)
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      {status === 'idle' && (
        <View style={s.center}>
          <Text style={s.title}>Find a plant 🌱</Text>
          <Text style={s.subtitle}>
            Photograph a leaf, a flower, or the whole plant — find out what it is and add it to your collection.
          </Text>

          <TouchableOpacity style={s.scanBtn} onPress={takePhoto} activeOpacity={0.85}>
            <Text style={s.scanIcon}>📷</Text>
            <Text style={s.scanLabel}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.linkBtn} onPress={pickGallery}>
            <Text style={s.linkText}>🖼  Pick from gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'scanning' && (
        <View style={s.center}>
          {preview && <Image source={{ uri: preview }} style={s.preview} />}
          <View style={s.row}>
            <ActivityIndicator color={C.leafDark} size="large" />
            <Text style={s.scanningText}>Identifying plant…</Text>
          </View>
        </View>
      )}

      {status === 'result' && result && (
        <ResultCard result={result} preview={preview} onScanAgain={reset} onGoCollection={onGoCollection} />
      )}

      {status === 'notplant' && (
        <View style={s.center}>
          {preview && <Image source={{ uri: preview }} style={s.previewSmall} />}
          <Text style={{ fontSize: 52 }}>🤔</Text>
          <Text style={s.title}>That doesn't look like a plant</Text>
          <Text style={s.subtitle}>
            Point the camera at a single leaf or flower, fill the frame, and try again.
          </Text>
          <TouchableOpacity style={s.scanBtnSmall} onPress={reset}>
            <Text style={s.scanLabel}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'error' && (
        <View style={s.center}>
          <Text style={{ fontSize: 52 }}>😕</Text>
          <Text style={s.title}>Something went wrong</Text>
          <Text style={s.subtitle}>Check your connection and try again.</Text>
          <TouchableOpacity style={s.scanBtnSmall} onPress={reset}>
            <Text style={s.scanLabel}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  center: { alignItems: 'center', paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '800', color: C.bark, marginTop: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 6, maxWidth: 300, lineHeight: 20 },
  scanBtn: {
    width: 180, height: 180, borderRadius: 90, backgroundColor: C.leaf,
    alignItems: 'center', justifyContent: 'center', marginTop: 36,
    shadowColor: C.leafDark, shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  scanBtnSmall: {
    paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999, backgroundColor: C.leaf, marginTop: 24,
  },
  scanIcon: { fontSize: 48 },
  scanLabel: { color: C.white, fontSize: 18, fontWeight: '800', marginTop: 6 },
  linkBtn: { marginTop: 28 },
  linkText: { color: C.leafDark, fontWeight: '700', fontSize: 15 },
  preview: { width: 240, height: 240, borderRadius: 28, marginBottom: 24 },
  previewSmall: { width: 140, height: 140, borderRadius: 20, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scanningText: { color: C.leafDark, fontWeight: '700', fontSize: 16 },
})
