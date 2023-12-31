import {ImageContainer, SuccessContainer} from '@/styles/pages/success'
import Link from 'next/link'
import {GetServerSideProps} from 'next'
import {stripe} from '@/lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import Head from 'next/head'


interface SuccessProps {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }
}

export default function Success({product, customerName}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        
        <meta name={"robots"} content={"noindex"}/>
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada!</h1>
        <ImageContainer>
          <Image src={product.imageUrl} width={120} height={110} alt={''}/>
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua
          casa.
        </p>

        <Link href={"/"}>
          Voltar ao catálogo
        </Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const {session_id: sessionId} = query
  if (!(typeof sessionId === 'string')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details?.name
  const product = session.line_items?.data[0].price?.product && session.line_items.data[0].price.product as Stripe.Product

  if (!(customerName === 'string') || !(typeof product === 'object')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      customerName,
      product: {
        name: product && product.name,
        imageUrl: product && product.images[0],
      }
    }
  }

}