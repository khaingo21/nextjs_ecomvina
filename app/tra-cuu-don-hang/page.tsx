import FullHeader from '@/components/FullHeader';
import BenefitsStrip from '@/components/BenefitsStrip';
import OrderLookupForm from '@/components/OrderLookupForm';
import OrderLookupResult from '@/components/OrderLookupResult';

const OrderTrackingPage = () => {
    return (
        <div className="page">
            <FullHeader showClassicTopBar={true} showTopNav={false} />
            <section className="py-20">
                <div className="container container-lg">
                    <div className="row gy-4 justify-content-center">
                        <div className="col-lg-8 col-xl-8">
                            <OrderLookupForm />
                            <OrderLookupResult />
                        </div>
                    </div>
                </div>
            </section>
            <BenefitsStrip />
        </div>
    );
};

export default OrderTrackingPage;