export function decodeMarket(acquiredInformation: string|number){
  if (typeof acquiredInformation === "number"){
    switch (acquiredInformation){
      case acquiredInformation = 513971200: return 'prisma'
      case acquiredInformation = 517608857: return 's-market'
      case acquiredInformation = 720571157: return 'herkku'
      case acquiredInformation = 708268115: return 'alepa'
      case acquiredInformation = 725782447: return 'sale'
      case acquiredInformation = 542854294: return 'sokos-herkku'
      case acquiredInformation = 519684690: return 'mestarin-herkku'
    }
  }
  if (typeof acquiredInformation === "string"){
    switch (acquiredInformation){
      case acquiredInformation = 'prisma': return 513971200
      case acquiredInformation = 's-market': return 517608857
      case acquiredInformation = 'herkku': return 720571157
      case acquiredInformation = 'alepa': return 708268115
      case acquiredInformation = 'sale': return 725782447
      case acquiredInformation = 'sokos-herkku': return 542854294
      case acquiredInformation = 'mestarin-herkku': return 519684690
    }
  }
  console.log('ERROR MARKET NAME')
  return 'error'
}