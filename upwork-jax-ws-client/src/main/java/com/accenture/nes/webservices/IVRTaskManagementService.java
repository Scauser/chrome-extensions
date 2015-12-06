
package com.accenture.nes.webservices;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Logger;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.6 in JDK 6
 * Generated source version: 2.1
 * 
 */
@WebServiceClient(name = "IVRTaskManagementService", targetNamespace = "http://webservices.nes.accenture.com", wsdlLocation = "file:/home/abhayk/workspaces/jar/Solexjar/IVRTaskManagementService.wsdl")
public class IVRTaskManagementService
    extends Service
{

    private final static URL IVRTASKMANAGEMENTSERVICE_WSDL_LOCATION;
    private final static Logger logger = Logger.getLogger(com.accenture.nes.webservices.IVRTaskManagementService.class.getName());

    static {
        URL url = null;
        try {
            URL baseUrl;
            baseUrl = com.accenture.nes.webservices.IVRTaskManagementService.class.getResource(".");
            url = new URL(baseUrl, "file:/home/abhayk/workspaces/jar/Solexjar/IVRTaskManagementService.wsdl");
        } catch (MalformedURLException e) {
            logger.warning("Failed to create URL for the wsdl Location: 'file:/home/abhayk/workspaces/jar/Solexjar/IVRTaskManagementService.wsdl', retrying as a local file");
            logger.warning(e.getMessage());
        }
        IVRTASKMANAGEMENTSERVICE_WSDL_LOCATION = url;
    }

    public IVRTaskManagementService(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public IVRTaskManagementService() {
        super(IVRTASKMANAGEMENTSERVICE_WSDL_LOCATION, new QName("http://webservices.nes.accenture.com", "IVRTaskManagementService"));
    }

    /**
     * 
     * @return
     *     returns IIVRTaskManagementService
     */
    @WebEndpoint(name = "IVRTaskManagementServiceImplPort")
    public IIVRTaskManagementService getIVRTaskManagementServiceImplPort() {
        return super.getPort(new QName("http://webservices.nes.accenture.com", "IVRTaskManagementServiceImplPort"), IIVRTaskManagementService.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns IIVRTaskManagementService
     */
    @WebEndpoint(name = "IVRTaskManagementServiceImplPort")
    public IIVRTaskManagementService getIVRTaskManagementServiceImplPort(WebServiceFeature... features) {
        return super.getPort(new QName("http://webservices.nes.accenture.com", "IVRTaskManagementServiceImplPort"), IIVRTaskManagementService.class, features);
    }

}
